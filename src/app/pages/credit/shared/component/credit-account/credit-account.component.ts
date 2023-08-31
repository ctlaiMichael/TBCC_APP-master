/**
 * 授信業務帳戶資訊(頭檔)
 * LOAN: 借款
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { DepositUtil } from '@shared/util/formate/mask/deposit-util';

@Component({
    selector: 'app-credit-account',
    templateUrl: './credit-account.component.html',
    styleUrls: [],

})
export class CreditAccountComponent implements OnInit {
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
    rate: string; // 目前利率
    expirDate: string; // 到期日

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
    ) {
    }


    ngOnInit() {
        switch (this.acctGroup) {
            case 'LOAN': this.modifyLOAN(); break;
        }

    }

    /**
     * 授信業務
     * 借款查詢
     */
    private modifyLOAN() {
        this.showContent = 'LOAN';
        this.acctNo = this._formateService.checkField(this.acctObj, 'acctNo');
        const rate = this._formateService.checkField(this.acctObj, 'rate');
        // 利率
        this.rate = this._formateService.transFinancial(rate, true);

        // 到期日
        const expirDate = this._formateService.checkField(this.acctObj, 'expirDate');
        this.expirDate = this._formateService.transDate(expirDate, 'date');
        // 現欠餘額
        const balance = this._formateService.checkField(this.acctObj, 'balence');
        this.balance = AmountUtil.currencyAmount(balance, this.currency);
    }
}

