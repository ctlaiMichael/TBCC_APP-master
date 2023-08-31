
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { NavgatorService } from '@core/navgator/navgator.service';
import { GoldSellBuyService } from '@pages/gold-business/shared/service/gold-sell-buy.service';
import { GoldbuyConfirmPageComponent } from '@pages/gold-business/gold-buy/confirm/goldbuy-confirm-page.component';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { GoldbuyDesc } from '@pages/gold-business/shared/goldbuy-desc';
import { CheckService } from '@shared/check/check.service';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-goldbuy-edit-page',
    templateUrl: 'goldbuy-edit-page.component.html'
})

export class GoldbuyEditPageComponent implements OnInit {
    @Output() goldbuyPage: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(GoldbuyConfirmPageComponent) goldbuyConfirm: GoldbuyConfirmPageComponent;

    // request
    goldbuyInfo = {
        'goldAccount': '',
        'goldQuantity': '',
        'trnsfrAccount': '',
        'USER_SAFE': '',
        'SEND_INFO': ''
    };
    // check error
    errorMsg: any = { 'goldAccount': '', 'goldQuantity': '', 'trnsfrAccount': '' };
    returnObj = {
        'pageName': 'confirm',
        'data': {}
    };
    goldAcctsList = [];   // 轉出帳號列表
    trnsfrAcctsList = []; // 轉出帳號列表
    balance = '';          // 可用餘額
    goldMenu: any;
    twMenu: any;
    // 安控傳參
    transactionObj = {
        serviceId: 'FB000709',
        categoryId: '7',
        transAccountType: '1',
    };

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private alert: AlertService
        , private navgator: NavgatorService
        , private goldSellBuy: GoldSellBuyService
        , private infomationService: InfomationService
        , private _checkService: CheckService
    ) { }

    ngOnInit() {
        this._headerCtrl.setLeftBtnClick(() => {
            this.doCancel();
        });

        const form = {};
        form['queryType'] = '2';
        this.goldSellBuy.getGoldAcctList(form)
            .then(
                (res) => {
                    // logger.debug('getGoldAcctList res:' + JSON.stringify(res));
                    if (res.goldAccts.detail.length > 0) {
                        this.goldAcctsList = res.goldAccts.detail;
                        this.goldbuyInfo.goldAccount = res.goldAccts.detail[0].acctNo;
                        this.goldMenu = res.goldAccts.detail[0];
                    }
                    if (res.trnsfrAccts.detail.length > 0) {
                        this.trnsfrAcctsList = res.trnsfrAccts.detail;
                        this.goldbuyInfo.trnsfrAccount = res.trnsfrAccts.detail[0].acctNo;
                        this.balance = res.trnsfrAccts.detail[0].usefulBalance;
                        this.twMenu = res.trnsfrAccts.detail[0];
                    }
                },
                (err) => {
                    // logger.debug('getGoldAcctList err:' + JSON.stringify(err));
                    err['type'] = 'message';
                    this._handleError.handleError(err);
                });
    }

    /**
     * 買進說明
     */
    goldDesc() {
        const set_data = new GoldbuyDesc();
        this.infomationService.show(set_data);
    }

    onChangeGoldAcct(menu: any) {
        // logger.debug('onChangeGoldAcct:' + JSON.stringify(menu));
        // logger.debug('goldbuyInfo:' + JSON.stringify(this.goldbuyInfo));
    }

    onChangeTwAcct(menu: any) {
        // logger.debug('onChangeTwAcct:' + JSON.stringify(menu));
        this.trnsfrAcctsList.forEach(element => {
            // logger.debug(JSON.stringify(element));
            if (element.acctNo === menu) {
                this.balance = element.usefulBalance;
            }
        });
        // logger.debug('goldbuyInfo:' + JSON.stringify(this.goldbuyInfo));
    }

    // 上一步
    doCancel() {
        this.goldbuyPage.emit({
            'pageName': 'statement',
            'data': {}
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

    // 清空錯誤訊息
    clearMsg() {
        this.goldbuyInfo.goldQuantity = '';
        this.errorMsg['goldQuantity'] = '';
    }

    // 確定
    checkEvent() {
        let checkNumber = this._checkService.checkNumber(this.goldbuyInfo.goldQuantity);
        if (!checkNumber.status) {
            this.errorMsg['goldQuantity'] = 'GOLD.BUY.WEIGHTE_ERROR';
            return;
        }
        if (!this.goldbuyInfo.SEND_INFO['status']) {
            // error handle
            let errorObj = {
                type: 'dialog',
                content: this.goldbuyInfo.SEND_INFO['message'],
                message: this.goldbuyInfo.SEND_INFO['message']
            };
            this._handleError.handleError(errorObj);
            return;
        }

        const form = {};
        form['recType'] = '1',
            form['goldAccount'] = this.goldbuyInfo.goldAccount,
            form['trnsfrAccount'] = this.goldbuyInfo.trnsfrAccount,
            form['goldQuantity'] = this.goldbuyInfo.goldQuantity,
            this.goldSellBuy.getTransConfirm(form)
                .then(
                    (res) => {
                        // logger.debug('getTransConfirm res:' + JSON.stringify(res));
                        // logger.debug('this.returnObj 1:' + JSON.stringify(this.returnObj));
                        this.returnObj.data = res;
                        this.returnObj.data['USER_SAFE'] = this.goldbuyInfo.USER_SAFE;
                        this.returnObj.data['SEND_INFO'] = this.goldbuyInfo.SEND_INFO;
                        // logger.debug('this.returnObj 2:' + JSON.stringify(this.returnObj));
                        this.goldbuyPage.emit(this.returnObj);
                    },
                    (err) => {
                        // logger.debug('getTransConfirm err:' + JSON.stringify(err));
                        err['type'] = 'message';
                        this._handleError.handleError(err);
                    });
    }

    // 安控檢核
    securityOptionBak(e) {
        // logger.debug('securityOptionBak:' + JSON.stringify(e));
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.goldbuyInfo.SEND_INFO = e.sendInfo;
            this.goldbuyInfo.USER_SAFE = e.sendInfo.selected;
        } else {
            // do errorHandle 錯誤處理 推業或POPUP
            // e.ERROR['type'] = 'message';
            // this._handleError.handleError(e);
            let error_obj: any = (!!e.ERROR) ? e.ERROR : e;
            error_obj['type'] = 'message';
            this._handleError.handleError(error_obj);
        }
    }


}
