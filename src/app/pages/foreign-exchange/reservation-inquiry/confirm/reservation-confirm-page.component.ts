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
import { ReservationInquiryService } from '@pages/foreign-exchange/shared/service/reservation-inquiry.service';
import { AuthService } from '@core/auth/auth.service';

// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';

@Component({
    selector: 'app-reservation-confirm',
    templateUrl: './reservation-confirm-page.component.html',
    styleUrls: [],
    // providers: [ForeignToForeignService]
})
export class ReservationConfirmComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() sendData;
    @Input() showPage;

    timeLeft: number = 60;
    interval;
    timeout_flag: boolean = false;//倒數=0，disable確定按鈕
    popupFlag: boolean = false;
    isReservation: boolean = false;
    formObj: any;
    resultData: any;

    //安控
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    }

    constructor(
        private _logger: Logger
        , private _checkSecurityService: CheckSecurityService
        , private _reservationInquiryService: ReservationInquiryService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        // , private confirm: ConfirmService
        // , private navgator: NavgatorService
        // , private _authService: AuthService
        , private authService: AuthService

    ) { }

    ngOnInit() {
        this.formObj = this.sendData.selectItem;
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.sendData.sendInfo
        }

        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
    }
    typeOf(value) {
        return typeof value;
    }
    cancelEdit() {
        // 回上一步
        let output = {
            fromPage: 'confirm',
            assignPage: 'list',
            data: {}
        }
        this.backPageEmit.emit(output);
    }

    onNextPgae() {
        // clearInterval(this.interval);
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.sendData.sendInfo
        }
    }

    replaceDash(str) {
        let replaceString = '';
        replaceString = str.replace(/\//g, '');
        return replaceString;
    }

    stepBack(e) {
        if (e.status) {
            if (e.securityType === '3') {
                e.otpObj.depositNumber = this.formObj.trnsfrOutAccnt; // 轉出帳號
                e.otpObj.depositMoney = this.formObj.trnsfrOutAccnt; // 金額
                e.otpObj.OutCurr = this.formObj.trnsfrCurr; // 幣別
                e.transTypeDesc = ''; //
            } else if (e.securityType === '2') {
                e.signText = {
                    custId: this.authService.getUserInfo().custId,
                    trnsfrDate: this.replaceDash(this.formObj.trnsfrDate),
                    orderNo: this.formObj.orderNo,
                    trnsToken: this.formObj.trnsToken,
                    trnsfrOutAccnt: this.formObj.trnsfrOutAccnt,
                    trnsfrInAccnt: this.formObj.trnsfrInAccnt,
                    trnsfrCurr: this.formObj.trnsfrCurr,
                    trnsfrAmount: this.formObj.trnsfrAmount,
                    subType: this.formObj.subType,
                    note: this.formObj.note
                };
            }
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
        this._reservationInquiryService.getResult(formObj, securityResult).then(
            (resObj) => {
                this.resultData = resObj.info_data;
                // let isReservationObj = { isReservation: this.formObj['isReservation'] };
                // this.resultData = Object.assign(this.resultData, isReservationObj);
                let output = {
                    fromPage: 'confirm',
                    assignPage: 'result',
                    data: this.resultData
                }
                this.backPageEmit.emit(output);
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            });

    }
}
