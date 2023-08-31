/**
 * Header
 */
import { Component, OnInit, Input, Renderer2, NgZone, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { AlertService } from '@shared/popup/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-goldbuy-confirm-page',
    templateUrl: 'goldbuy-confirm-page.component.html'
})

export class GoldbuyConfirmPageComponent implements OnInit,OnDestroy {
    @Input() goldbuyInfo;
    @Output() goldbuyPage: EventEmitter<any> = new EventEmitter<any>();

    confirmShowInfo: any;
    goldbuyConfirmInfo = {
        'recType': '1',
        'goldAccount': '',
        'trnsfrAccount': '',
        'goldQuantity': '',
        'goldRateTime': '',
        'gold1GAmt': '',
        'transAmt': '',
        'discountAmt': '',
        'trnsToken': '',
        'USER_SAFE': '',
        'SEND_INFO': ''
    };
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    };
    returnObj = {
        'pageName': 'result',
        'data': {},
        'security': {}
    };
    timeObj: any;
    timeLimit: any;

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _checkSecurityService: CheckSecurityService
        , private alert: AlertService
        , private _authService: AuthService
    ) { }

    ngOnInit() {

        this.prepareData();

        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '交易確認'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.doCancel();
        });
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.goldbuyInfo.SEND_INFO
        };
    }

    ngOnDestroy() {
        clearInterval(this.timeObj);
    }

    // 計時
    countTimer(time) {
        if (time) {
            this.timeObj = setTimeout(() => {
                if (this.timeLimit > 0) {
                    // logger.debug(this.timeLimit);
                    this.timeLimit = this.timeLimit - 1;
                    this.countTimer(this.timeLimit);
                }
            }, 1000);
        } else {
            // logger.debug('count stop');
            this.countTimerStop(this.timeObj);
        }
    }

    // 清除倒數
    countTimerStop(timeObj) {
        clearTimeout(timeObj);
        return this.alert.show('GOLD.BUY.TIMEOUT', { title: '' })
            .then(() => { this.navgator.popTo('gold-business'); });
    }

    prepareData() {
        // logger.debug('goldbuyInfo:' + JSON.stringify(this.goldbuyInfo));
        // limit time
        this.timeLimit = this.goldbuyInfo.timeLimit;
        this.countTimer(this.timeLimit);

        // confirm Display
        this.confirmShowInfo = this.goldbuyInfo;

        // result
        this.goldbuyConfirmInfo.goldAccount = this.goldbuyInfo.goldAccount;
        this.goldbuyConfirmInfo.trnsfrAccount = this.goldbuyInfo.trnsfrAccount;
        this.goldbuyConfirmInfo.goldQuantity = this.goldbuyInfo.goldQuantity;
        this.goldbuyConfirmInfo.goldRateTime = this.goldbuyInfo.goldRateTime;
        this.goldbuyConfirmInfo.gold1GAmt = this.goldbuyInfo.gold1GAmt;
        this.goldbuyConfirmInfo.transAmt = this.goldbuyInfo.transAmt;
        this.goldbuyConfirmInfo.discountAmt = this.goldbuyInfo.discountAmt;
        this.goldbuyConfirmInfo.trnsToken = this.goldbuyInfo.trnsToken;
    }

    // 上一步(返回編輯)
    doCancel() {
        this.goldbuyPage.emit({
            'pageName': 'edit',
        });
        // const confirmOpt = new ConfirmOptions();
        // confirmOpt.btnYesTitle = 'BTN.CHECK';
        // confirmOpt.btnNoTitle = 'BTN.CANCEL';
        // confirmOpt.title = 'POPUP.CANCEL_EDIT.TITLE';
        // this.confirm.show('POPUP.CANCEL_EDIT.CONTENT', confirmOpt)
        //     .then(() => {
        //         clearTimeout(this.timeObj);
        //         this.navgator.popTo('gold-business');
        //     })
        //     .catch(() => { });
    }

    // 確定
    goResult() {
        // logger.debug('goResult');
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.goldbuyInfo.SEND_INFO
        };

    }
    stepBack(e) {
        // logger.debug('stepBack');
        // logger.debug(e);
        if (e.status) {
            if (e.securityType === '2') {
                e.signText = {
                    'custId': this._authService.getUserInfo().custId,
                    'recType': this.goldbuyConfirmInfo.recType,
                    'goldAccount': this.goldbuyConfirmInfo.goldAccount,
                    'trnsfrAccount': this.goldbuyConfirmInfo.trnsfrAccount,
                    'goldQuantity': this.goldbuyConfirmInfo.goldQuantity,
                    'goldRateTime': this.goldbuyConfirmInfo.goldRateTime,
                    'gold1GAmt': this.goldbuyConfirmInfo.gold1GAmt,
                    'transAmt': this.goldbuyConfirmInfo.transAmt,
                    'discountAmt': this.goldbuyConfirmInfo.discountAmt,
                    'trnsToken': this.goldbuyConfirmInfo.trnsToken
                };
            }
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    // logger.debug(S);
                    this.returnObj.data = this.goldbuyConfirmInfo;
                    this.returnObj.security = S.headerObj;
                    clearTimeout(this.timeObj);
                    this.goldbuyPage.emit(this.returnObj);
                }, (F) => {
                    logger.debug(F);
                    clearTimeout(this.timeObj);
                    // return this.alert.show('GOLD.BUY.DO_SECURITY_FAIL', { title: '' })
                    //  .then( () => {this.navgator.popTo('gold-business'); });
                }
            );
        } else {
            return false;
        }
    }
}
