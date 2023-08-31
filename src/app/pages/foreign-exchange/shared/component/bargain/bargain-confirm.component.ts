/**
 * 議價匯率確認
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckService } from '@shared/check/check.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { TwdToForeignService } from '@pages/foreign-exchange/shared/service/twd-to-foreign.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Component({
    selector: 'app-bargain-confirm',
    templateUrl: './bargain-confirm.component.html',
    styleUrls: [],
    providers: []
})
export class BargainConfirmComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() formObj;

    timeLeft: number = 60;
    interval;
    timeout_flag: boolean = false;//倒數=0，disable確定按鈕
    popupFlag: boolean = false;
    info_data: object;//取得電文資料
    resultData;
    //安控
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }
    doubFlag=true;  //重複交易
    constructor(
        private _logger: Logger
        , private _checkSecurityService: CheckSecurityService
        , private _mainService: TwdToForeignService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _authService: AuthService
        , private _formateService: FormateService
        , private logger:Logger
    ) {
    }

    ngOnInit() {
        this.logger.error('init confirm',this.formObj);
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });

        this.formObj.SEND_INFO.serviceId = 'F5000111';

        this.securityObj = {
            'action': 'init',
            'sendInfo': this.formObj.SEND_INFO
        }

    }

    cancelEdit() {
        this.backPageEmit.emit({});
    }

    onNextPgae() {
        if(this.doubFlag){
            this.securityObj = {
                'action': 'submit',
                'sendInfo': this.formObj.SEND_INFO
            }
        }
        this.doubFlag=false;
    }

    stepBack(e) {
        let signObj = {
            custId: this._authService.getUserInfo().custId,
            trnsfrOutAccnt: this.formObj.trnsfrOutAccnt,
            trnsfrOutCurr: this.formObj.trnsfrOutCurr,
            trnsfrOutAmount: AmountUtil.amount(this.formObj.trnsfrOutAmount).replace(/,/g,''),
            trnsfrInAccnt: this.formObj.trnsfrInAccnt,
            trnsInSetType: this.formObj.trnsInSetType,
            trnsfrInCurr: this.formObj.trnsfrInCurr,
            trnsfrInAmount: AmountUtil.amount(this.formObj.trnsfrInAmount).replace(/,/g,''),
            subType: this.formObj.subType,
            trnsfrRate:  Number.parseFloat(this.formObj.negotiatedRate).toFixed(4).toString(),//議價匯率
            trnsfrCurr: this.formObj.trnsfrCurr,
            note: this.formObj.note,
            negotiatedBranch: this.formObj.negotiatedBranch,
            negotiatedNo: this.formObj.negotiatedNo,
            negotiatedCurr: this.formObj.negotiatedRate,
            trnsToken: this.formObj.trnsToken,
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
            this.logger.log('SIGN',signObj);
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    this.logger.log('加密成功');
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
        this.logger.log('getResult',formObj, securityResult);
        this._mainService.getBargainResult(formObj, securityResult).then(
            (resObj) => {
                this.resultData = resObj.info_data;
                let isReservationObj = { subType: this.formObj['subType'], subTypeDscp: this.formObj['subTypeDscp'] };
                this.resultData = Object.assign(this.resultData, isReservationObj);
                let output = {
                    fromPage: 'confirm_page',
                    assignPage: 'bargain_result_page',
                    data: this.resultData
                };
                this.backPageEmit.emit(output);
                this.doubFlag=true;
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                this.doubFlag=true;
            });
    }

    /**
     * 過交易時間
     */
    confirm_notification() {
        this.navgator.push('foreign-exchange');
    }
}
