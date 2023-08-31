/**
 * 外匯業務外轉台
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckService } from '@shared/check/check.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { ForeignToTwdService } from '@pages/foreign-exchange/shared/service/foreign-to-twd.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';

@Component({
    selector: 'app-foreign-to-twd-confirm',
    templateUrl: './foreign-to-twd-confirm.component.html',
    styleUrls: [],
    providers: [ForeignToTwdService]
})
export class ForeignToTwdConfirmComponent implements OnInit {
    /**
       *參數設定
       */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() formObj;
    timeLeft: number = 60;
    interval;
    timeout_flag: boolean = false;//倒數=0，disable確定按鈕
    popupFlag: boolean = false;
    info_data: object;//取得電文資料
    isReservation: boolean;
    resultData;
    str1;
    //安控
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }
    constructor(
        private _logger: Logger
        , private _checkSecurityService: CheckSecurityService
        , private _mainService: ForeignToTwdService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _authService: AuthService
        , private _formateService: FormateService
    ) {
    }

    ngOnInit() {
        
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
        this.isReservation = this.formObj['isReservation'];
        // 即時交易備註欄位選擇成交匯率則顯示電文回覆的成交匯率
        if (this.formObj.hasOwnProperty('isReservation') && this.formObj['isReservation'] === false) {
            this.formObj.SEND_INFO.serviceId='F5000103';
            // 即時轉帳倒數機制
            this.interval = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                } else if (this.timeLeft === 0) {
                    this.timeout_flag = true;
                } else {
                    clearInterval(this.interval);
                }
            }, 1000)
            // 預約交易備註欄位選擇成交匯率則顯示"成交匯率"字串
        } else {
            this.formObj.SEND_INFO.serviceId='F5000105';
        }
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.formObj.SEND_INFO
        }

        this.str1 = '目前外匯市場匯價波動劇烈，改以成本匯率承作。本行牌告匯率：' + this.formObj.rate + '，本筆成交匯率：' + this.formObj.trnsfrRate + '。若要承作請按確定。';
        if (this.formObj.rate > this.formObj.trnsfrRate) {
            this.confirm.show(this.str1 , {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    // if (type == '1') {
                    //     this.navgator.back();
                    // } else {
                    //     this.navgator.push('foreign-exchange');
                    // }
                },
                () => {
                    this.cancelEdit();
                }
            );
        }

    }

    cancelEdit() {
        this.backPageEmit.emit({});
    }

    onNextPgae() {
        clearInterval(this.interval);
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.formObj.SEND_INFO
        }
    }

    stepBack(e) {
        let signObj;

        if (this.formObj.isReservation) {
            //預約105
            signObj = {
                custId: this._authService.getUserInfo().custId,
                trnsfrDate: this._formateService.transDate(this.formObj.trnsfrDate, { formate: 'yyyMMdd', chinaYear: true }),
                trnsfrOutAccnt: this.formObj.trnsfrOutAccnt,
                trnsfrOutCurr: this.formObj.trnsfrOutCurr,
                trnsfrInAccnt: this.formObj.trnsfrInAccnt,
                trnsInSetType: this.formObj.trnsInSetType,
                trnsfrInCurr: this.formObj.trnsfrInCurr,
                trnsfrAmount: this.formObj.trnsfrAmount,
                trnsfrCurr: this.formObj.trnsfrCurr,
                subType: this.formObj.subType,
                subTypeDscp: this.formObj.subTypeDscp,
                note: this.formObj.note,
                trnsToken: this.formObj.trnsToken
            };
        } else {
            //即時103
            signObj = {
                custId: this._authService.getUserInfo().custId,
                trnsfrOutAccnt: this.formObj.trnsfrOutAccnt,
                trnsfrOutCurr: this.formObj.trnsfrOutCurr,
                trnsfrOutAmount: this.formObj.trnsfrOutAmount,
                trnsfrInAccnt: this.formObj.trnsfrInAccnt,
                trnsInSetType: this.formObj.trnsInSetType,
                trnsfrInCurr: this.formObj.trnsfrInCurr,
                trnsfrInAmount: this.formObj.trnsfrInAmount,
                subType: this.formObj.subType,
                trnsfrRate: this.formObj.trnsfrRate,
                trnsfrCostRate: this.formObj.trnsfrCostRate,
                note: this.formObj.note,
                businessType: this.formObj.businessType,
                trnsToken: this.formObj.trnsToken,
                openNightChk: 'Y'
            };
        }
        if (e.status) {
            if (e.securityType === '3') {
                e.otpObj.depositNumber = ''; // 轉出帳號
                e.otpObj.depositMoney = ''; // 金額
                e.otpObj.OutCurr = ''; // 幣別
                e.transTypeDesc = ''; //
            } else if (e.securityType === '2') {
                e.signText = signObj;
            };
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    if (S.ERROR.status == true) {
                        this.getResult(this.formObj, S);
                    } else {
                    }
                }, (F) => {
                    this.backPageEmit.emit({
                        securityResult: F
                    });
                }
            );
        } else {
            return false;
        }
    }

    getResult(formObj, securityResult) {
        this._mainService.getResult(formObj, securityResult).then(
            (resObj) => {
                this.resultData = resObj.info_data;
                let isReservationObj = { isReservation: this.formObj['isReservation'], subType: this.formObj['subType'], subTypeDscp: this.formObj['subTypeDscp'] };
                this.resultData = Object.assign(this.resultData, isReservationObj);
                let output = {
                    fromPage: 'confirm_page',
                    assignPage: 'result_page',
                    data: this.resultData
                }
                this.backPageEmit.emit(output);
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            });
    }
    /**
     * 過交易時間
     */
    confirm_notification() {
        this.navgator.push('foreign-exchange');
    }
}
