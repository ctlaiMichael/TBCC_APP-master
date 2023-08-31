import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { AuthService } from '@core/auth/auth.service';
import { GoldtermsResultPageComponent } from '@pages/gold-business/goldterms/result/goldterms-result-page.component';
import { GoldTermsService } from '@pages/gold-business/shared/service/gold-terms.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-goldterms-confirm-page',
    templateUrl: 'goldterms-confirm-page.component.html'
})

export class GoldtermsConfirmPageComponent implements OnInit {
    @Input() goldtermsInfo;
    @Output() goldtermsPage: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(GoldtermsResultPageComponent) goldtermsResult: GoldtermsResultPageComponent;

    goldTermStatus = '';
    goldtermsConfirmInfo = {
        'goldAccount': '',
        'trnsfrOutAccount': '',
        'fixAmount6': '',
        'fixAmount16': '',
        'fixAmount26': '',
        'fixFee': '',
        'fixCloseDay': '',
        'pauseCode': '',
        'pauseBeginDay': '',
        'pauseEndDay': '',
        'fixCode': '',
        'trnsToken': ''
    };
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    };
    returnObj = {
        'pageName': 'result',
        'data': {},
        'confirmData': {}
    };
    security: any;

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService
        , private goldTerms: GoldTermsService
        , private _handleError: HandleErrorService
    ) { }

    ngOnInit() {
        // logger.debug('GoldtermsConfirmPageComponent goldtermsInfo:' + JSON.stringify(this.goldtermsInfo));
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': 'GOLD.TERMS.TITLE_CONFIRM'
        });
        switch (this.goldtermsInfo.org.fixCode) {
            case '1':
                this.goldTermStatus = '未約定';
                break;
            case '2':
                switch (this.goldtermsInfo.org.pauseCode) {
                    case '' || null:
                        this.goldTermStatus = '正常扣款';
                        break;
                    case '1':
                        this.goldTermStatus = '暫停扣款';
                        break;
                    case '2':
                        this.goldTermStatus = '恢復扣款';
                        break;
                }
                break;
        }

        this.prepareData();

        this._headerCtrl.setLeftBtnClick(() => {
            this.doCancel();
        });
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.goldtermsInfo.SEND_INFO
        };
    }

    prepareData() {
        // logger.debug('goldtermsInfo:' + JSON.stringify(this.goldtermsInfo));
        // result
        this.goldtermsConfirmInfo.goldAccount = this.goldtermsInfo.goldAccount;
        this.goldtermsConfirmInfo.trnsfrOutAccount = this.goldtermsInfo.trnsfrOutAccount;
        this.goldtermsConfirmInfo.fixAmount6 = this.goldtermsInfo.fixAmount6;
        this.goldtermsConfirmInfo.fixAmount16 = this.goldtermsInfo.fixAmount16;
        this.goldtermsConfirmInfo.fixAmount26 = this.goldtermsInfo.fixAmount26;
        this.goldtermsConfirmInfo.fixFee = this.goldtermsInfo.fixFee;
        this.goldtermsConfirmInfo.fixCloseDay = (this.goldtermsInfo.fixCloseDay === null) ? '' : this.goldtermsInfo.fixCloseDay;
        this.goldtermsConfirmInfo.pauseCode = (this.goldtermsInfo.pauseCode === null) ? '' : this.goldtermsInfo.pauseCode;
        this.goldtermsConfirmInfo.pauseBeginDay = (!!this.goldtermsInfo.pauseBeginDay && this.goldtermsInfo.pauseBeginDay.indexOf('-') > 0) ?
            this.goldtermsInfo.pauseBeginDay.replace(/-/g, '') :
            ((this.goldtermsInfo.pauseBeginDay === null) ? '' : this.goldtermsInfo.pauseBeginDay);
        this.goldtermsConfirmInfo.pauseEndDay = (!!this.goldtermsInfo.pauseEndDay && this.goldtermsInfo.pauseEndDay.indexOf('-') > 0) ?
            this.goldtermsInfo.pauseEndDay.replace(/-/g, '') :
            ((this.goldtermsInfo.pauseEndDay === null) ? '' : this.goldtermsInfo.pauseEndDay);
        this.goldtermsConfirmInfo.fixCode = this.goldtermsInfo.fixCode;
        this.goldtermsConfirmInfo.trnsToken = this.goldtermsInfo.trnsToken;
    }

    // 上一步
    doCancel() {
        this.goldtermsPage.emit({
            'pageName': 'edit',
            'fromConfirm':true
        });
        // const confirmOpt = new ConfirmOptions();
        // confirmOpt.btnYesTitle = 'BTN.CHECK';
        // confirmOpt.btnNoTitle = 'BTN.CANCEL';
        // confirmOpt.title = 'POPUP.CANCEL_EDIT.TITLE';
        // this.confirm.show('POPUP.CANCEL_EDIT.CONTENT', confirmOpt)
        //     .then(() => {
        //         this.navgator.popTo('gold-business');
        //     })
        //     .catch(() => { });
    }

    // 確定
    goResult() {
        // logger.debug('goResult');
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.goldtermsInfo.SEND_INFO
        };

    }

    onSend() {
        // logger.debug('onSend goldtermsConfirmInfo:' + JSON.stringify(this.goldtermsConfirmInfo));
        // logger.debug('onSend security:' + JSON.stringify(this.security));
        this.goldTerms.setGoldtermsInfo(this.goldtermsConfirmInfo, this.security)
            .then(
                (res) => {
                    // logger.debug('setGoldtermsInfo res:' + JSON.stringify(res));
                    if (res.trnsRsltCode === '0' && (res.hostCode === '0000' || res.hostCode === '4001')) {
                        this.returnObj = res;
                        this.returnObj['pageName'] = 'result';
                        delete this.goldtermsInfo.org.goldAccts;
                        delete this.goldtermsInfo.org.trnsfrAcctsList;
                        this.returnObj.confirmData = this.goldtermsInfo;
                        // logger.debug('returnObj:' + JSON.stringify(this.returnObj));
                        this.goldtermsPage.emit(this.returnObj);
                    } else {
                        let err = new HandleErrorOptions(res.hostCodeMsg, 'ERROR.TITLE');
                        err.resultCode = res.hostCode;
                        err.resultData = res;
                        err['type'] = 'message';
                        this._handleError.handleError(err);
                    }
                },
                (err) => {
                    // logger.debug('setGoldtermsInfo err:' + JSON.stringify(err));
                    err['type'] = 'message';
                    this._handleError.handleError(err);
                });
    }

    stepBack(e) {
        // logger.debug('stepBack');
        // logger.debug(e);
        if (e.status) {
            if (e.securityType === '2') {
                e.signText = {
                    'custId': this._authService.getUserInfo().custId,
                    'goldAccount': this.goldtermsConfirmInfo.goldAccount,
                    'trnsfrOutAccount': this.goldtermsConfirmInfo.trnsfrOutAccount,
                    'fixAmount6': this.goldtermsConfirmInfo.fixAmount6,
                    'fixAmount16': this.goldtermsConfirmInfo.fixAmount16,
                    'fixAmount26': this.goldtermsConfirmInfo.fixAmount26,
                    'fixFee': this.goldtermsConfirmInfo.fixFee,
                    'fixCloseDay': this.goldtermsConfirmInfo.fixCloseDay,
                    'pauseCode': this.goldtermsConfirmInfo.pauseCode,
                    'pauseBeginDay': this.goldtermsConfirmInfo.pauseBeginDay,
                    'pauseEndDay': this.goldtermsConfirmInfo.pauseEndDay,
                    'fixCode': this.goldtermsConfirmInfo.fixCode,
                    'trnsToken': this.goldtermsConfirmInfo.trnsToken
                };
            }
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    this.security = S.headerObj;
                    this.onSend();
                }, (F) => {
                    logger.debug(F);
                }
            );
        } else {
            return false;
        }
    }
}
