import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { NavgatorService } from '@core/navgator/navgator.service';
import { GoldSellBuyService } from '@pages/gold-business/shared/service/gold-sell-buy.service';
import { GoldTermsService } from '@pages/gold-business/shared/service/gold-terms.service';
import { GoldtermsEditPageComponent } from '@pages/gold-business/goldterms/edit/goldterms-edit-page.component';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
    selector: 'app-goldterms-selectacct-page',
    templateUrl: 'goldterms-selectacct-page.component.html'
})

export class GoldtermsSelectacctPageComponent implements OnInit {
    @Output() goldtermsPage: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(GoldtermsEditPageComponent) goldtermsEdit: GoldtermsEditPageComponent;

    returnObj = {
        'pageName': 'edit',
        'data': {}
    };
    goldAcctsList = [];   // 轉出帳號列表
    trnsfrAcctsList = []; // 轉出帳號列表

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private alert: AlertService
        , private navgator: NavgatorService
        , private goldSellBuy: GoldSellBuyService
        , private goldTerms: GoldTermsService
    ) {}

    ngOnInit() {
        // 設定title文字
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': 'GOLD.TERMS.TITLE_SELECTACCT'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.doCancel();
        });

        // 取得黃金存摺清單(fb000705)
        const form = {};
        form['queryType'] = '4';
        this.goldSellBuy.getGoldAcctList(form)
        .then(
        (res) => {
            // logger.debug('getGoldAcctList res:' + JSON.stringify(res));
            if (res.goldAccts.detail.length > 0) {
                this.goldAcctsList = res.goldAccts.detail;
            }
            if (res.trnsfrAccts.detail.length > 0) {
                this.trnsfrAcctsList = res.trnsfrAccts.detail;
            }
        },
        (err) => {
            // logger.debug('getGoldAcctList err:' + JSON.stringify(err));
            err['type'] = 'message';
            this._handleError.handleError(err);
        });
    }

    onClick(menu) {
        // logger.debug('onClick:' + JSON.stringify(menu));

        // 黃金存摺定期定額買進查詢(fb000710)
        const form = {};
        form['goldAccount'] = menu.acctNo;
        this.goldTerms.getGoldtermsInfo(form)
        .then(
        (res) => {
            // logger.debug('getGoldtermsInfo res:' + JSON.stringify(res));
            if (this.goldAcctsList.length > 0) {
                res['goldAccts'] = this.goldAcctsList;
            }
            if (this.trnsfrAcctsList.length > 0) {
                res['trnsfrAcctsList'] = this.trnsfrAcctsList;
            }
            // logger.debug('go to edit');
            this.returnObj.data = res;
            this.goldtermsPage.emit(this.returnObj);
        },
        (err) => {
            // logger.debug('getGoldtermsInfo err:' + JSON.stringify(err));
            err['type'] = 'message';
            this._handleError.handleError(err);
        });
    }

    // 上一步
    doCancel() {
        this.goldtermsPage.emit({
            'pageName': 'statement',
        });
        // const confirmOpt = new ConfirmOptions();
        // confirmOpt.btnYesTitle = 'BTN.CHECK';
        // confirmOpt.btnNoTitle = 'BTN.CANCEL';
        // confirmOpt.title = 'POPUP.CANCEL_EDIT.TITLE';
        // this.confirm.show('POPUP.CANCEL_EDIT.CONTENT', confirmOpt)
        // .then(() => {
        //     this.navgator.popTo('gold-business');
        // })
        // .catch(() => {});
    }
}
