/**
 * 帳戶資訊
 * TW: 台幣
 * FOREX: 外幣
 * GOLD: 黃金存摺
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { DepositUtil } from '@shared/util/formate/mask/deposit-util';

@Component({
    selector: 'app-account-content',
    templateUrl: './account-content.component.html',
    styleUrls: [],

})
export class AccountContentComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() acctObj;
    @Input() acctGroup: string; // 存款帳戶
    showContent = ''; // 是否顯示內容
    acctNo: string; // 帳號
    openBranchId: string; // 開戶分行代碼
    openBranchName: string; // 開戶分行名稱
    acctTypeName: string; // 帳戶別名稱
    acctType: string; // 帳戶別代碼
    currency: string; // 幣別
    balance: string; // 餘額
    lastTrnsDateName: string; // 最後交易日/定存到期日欄位名稱
    lastTrnsDate: string; // 最後交易日/定存到期日
    // 授信業務借款查詢
    rate: string;//目前利率
    expirDate: string;//到期日

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
    ) {
    }


    ngOnInit() {
        switch (this.acctGroup) {
            case 'TW': this.modifyTW(); break;
            case 'FOREX': this.modifyFOREX(); break;
            case 'GOLD': this.modifyGOLD(); break;
            case 'LOAN': this.modifyLOAN(); break;
        }

    }


    private modifyTW() {
        this.showContent = 'TW';
        this.currency = '';
        this.acctNo = this._formateService.checkField(this.acctObj, 'acctNo');
        this.openBranchId = this._formateService.checkField(this.acctObj, 'openBranchId');
        this.openBranchName = this._formateService.checkField(this.acctObj, 'openBranchName');
        this.acctType = this._formateService.checkField(this.acctObj, 'acctType');
        const acctTypeName = this._formateService.checkField(this.acctObj, 'acctTypeName');
        // this.acctTypeName = DepositUtil.acctTypeNickName(this.acctType, ['TW', acctTypeName]);
        this.acctTypeName = DepositUtil.acctTypeNickName(this.acctType, ['TW_header', acctTypeName]); // 換行處理

        // lastTrnsDate
        this.lastTrnsDateName = DepositUtil.transLastTransType(this.acctType, 'TW');
        const lastTrnsDate = this._formateService.checkField(this.acctObj, 'lastTrnsDate');
        this.lastTrnsDate = this._formateService.transDate(lastTrnsDate, 'date');
        // 餘額
        const balance = this._formateService.checkField(this.acctObj, 'balance');
        this.balance = AmountUtil.currencyAmount(balance, this.currency);
    }

    /**
     * 外匯
     */
    private modifyFOREX() {
        this.showContent = 'FOREX';
        this.currency = this._formateService.checkField(this.acctObj, 'currency');
        this.acctNo = this._formateService.checkField(this.acctObj, 'acctNo');
        this.openBranchId = this._formateService.checkField(this.acctObj, 'openBranchId');
        this.openBranchName = this._formateService.checkField(this.acctObj, 'openBranchName');
        this.acctType = this._formateService.checkField(this.acctObj, 'acctType');
        const acctTypeName = this._formateService.checkField(this.acctObj, 'acctTypeName');
        this.acctTypeName = DepositUtil.acctTypeNickName(this.acctType, ['FOREX', acctTypeName]);

        // lastTrnsDate
        this.lastTrnsDateName = DepositUtil.transLastTransType(this.acctType, 'FOREX');
        const lastTrnsDate = this._formateService.checkField(this.acctObj, 'lastTrnsDate');
        this.lastTrnsDate = this._formateService.transDate(lastTrnsDate, 'date');
        // 餘額
        const balance = this._formateService.checkField(this.acctObj, 'balance');
        this.balance = AmountUtil.currencyAmount(balance, this.currency);
    }

    /**
     * 黃金
     */
    private modifyGOLD() {
        this.showContent = 'GOLD';
        this.acctNo = this._formateService.checkField(this.acctObj, 'acctNo');
        this.acctType = this._formateService.checkField(this.acctObj, 'acctType');
        this.openBranchId = this._formateService.checkField(this.acctObj, 'openBranchId');
        this.openBranchName = this._formateService.checkField(this.acctObj, 'openBranchName');
        // this.acctTypeName = this._formateService.checkField(this.acctObj, 'acctTypeName');
        const acctTypeName = DepositUtil.getAcctTypeName(this.acctNo, '');
        if (acctTypeName == '') {
            this.acctTypeName = this._formateService.checkField(this.acctObj, 'acctTypeName');
        } else {
            this.acctTypeName = acctTypeName;
        }
        // lastTrnsDate
        this.lastTrnsDateName = DepositUtil.transLastTransType(this.acctType, 'GOLD');
        const lastTrnsDate = this._formateService.checkField(this.acctObj, 'lastTrnsDate');
        this.lastTrnsDate = this._formateService.transDate(lastTrnsDate, 'date');

    }
    /**
     * 授信業務
     * 借款查詢
     */
    private modifyLOAN() {
        this.showContent = 'LOAN';
        this.acctNo = this._formateService.checkField(this.acctObj, 'acctNo');
        this.rate = this._formateService.checkField(this.acctObj, 'rate');

        // 到期日
        const expirDate = this._formateService.checkField(this.acctObj, 'expirDate');
        this.expirDate = this._formateService.transDate(expirDate, 'date');
        // 現欠餘額
        const balance = this._formateService.checkField(this.acctObj, 'balence');
        this.balance = AmountUtil.currencyAmount(balance, this.currency);
    }
}

