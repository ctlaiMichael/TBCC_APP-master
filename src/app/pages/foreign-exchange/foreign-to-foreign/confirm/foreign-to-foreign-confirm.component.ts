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
import { ForeignToForeignService } from '@pages/foreign-exchange/shared/service/foreign-to-foreign.service';
import { AuthService } from '@core/auth/auth.service';

// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';

@Component({
    selector: 'app-foreign-to-foreign-confirm',
    templateUrl: './foreign-to-foreign-confirm.component.html',
    styleUrls: [],
    providers: [ForeignToForeignService]
})
export class ForeignToForeignConfirmComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() formObj;

    timeLeft: number = 60;
    interval;
    timeout_flag: boolean = false;//倒數=0，disable確定按鈕
    popupFlag: boolean = false;
    isReservation: boolean = false;
    resultData;

    //安控
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }

    constructor(
        private _logger: Logger
        , private _checkSecurityService: CheckSecurityService
        , private _mainService: ForeignToForeignService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _authService: AuthService
        , private authService: AuthService

    ) { }

    ngOnInit() {
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.formObj.SEND_INFO
        }
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
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

        if (e.status) {
            if (e.securityType === '3') {
                e.otpObj.depositNumber = ''; // 轉出帳號
                e.otpObj.depositMoney = ''; // 金額
                e.otpObj.OutCurr = ''; // 幣別
                e.transTypeDesc = ''; //
            } else if (e.securityType === '2') {
                e.signText = {
                    custId: this.authService.getUserInfo().custId,
                    trnsfrOutAccnt: this.formObj.trnsfrOutAccnt,
                    trnsfrOutCurr: this.formObj.trnsfrOutCurr,
                    trnsfrOutAmount: this.formObj.trnsfrOutAmount,
                    trnsfrInAccnt: this.formObj.trnsfrInAccnt,
                    trnsfrInId: this.formObj.trnsfrInId,
                    trnsfrInCurr: this.formObj.trnsfrInCurr,
                    trnsfrInAmount: this.formObj.trnsfrInAmount,
                    trnsfrOutRate: this.formObj.trnsfrOutRate,
                    trnsfrInRate: this.formObj.trnsfrInRate,
                    note: this.formObj.note,
                    businessType: this.formObj.businessType,
                    trnsToken: this.formObj.trnsToken,
                };
            };
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    if (S.ERROR.status == true) {
                        this.getResult(this.formObj, S);
                    }else {
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
                let isReservationObj = { isReservation: this.formObj['isReservation'] };
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
