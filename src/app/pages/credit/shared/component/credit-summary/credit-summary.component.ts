/**
 * 帳戶彙總資料
 * acctGroup: TW 台幣, FOREX 外幣, GOLD 黃金
 */
import { Component, Input, OnChanges } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CreditSummaryService } from '@pages/credit/shared/component/credit-summary/credit-summary.service';

@Component({
    selector: 'app-credit-summary',
    templateUrl: './credit-summary.component.html',
    styleUrls: [],

})
export class CreditSummaryComponent implements OnChanges {
    /**
     * 參數處理
     */
    @Input() acctObj: {};
    @Input() itemData: {}; // 不發電文直接傳入data
    @Input() setTime: string; // 傳進來的日期
    @Input() acctGroup: string; // 存款帳戶
    showContent = ''; // 是否顯示內容
    dataTime: string;
    data: any = {
        balance: '', // 現欠本金
        nowRate: '', // 目前利率
        loanCredit: '', // 借款額度
        loanDate: '', // 借款日
        expirDate: '', // 到期日
        ltrateDueDate: '', // 上次利息收訖日
        isranDueDate: '', // 保險到期日
        aupayAccount: '', // 委託繳息帳號
        anuMonPay: '' // 每月攤還本息
    };
    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _mainService: CreditSummaryService,
        private _handleError: HandleErrorService
    ) {
        this.dataTime = '';
    }


    ngOnChanges() {
        let reqObj: any = {};

        switch (this.acctGroup) {
            case 'LOAN': // 借款資料
                this.showContent = 'LOAN';
                this.getData(this.itemData).then(
                    (jsonObj) => {
                        // 回傳資料整理
                        this.data = jsonObj['data'];
                        this.dataTime = (this.setTime) ? this.setTime : '';
                    },
                    () => {}
                );
                break;
            default:
                this.showContent = 'GROUP_ERROR';
                break;
        }

    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------
    private getData(req_data): Promise<any> {

        return this._mainService.getSummaryData(this.acctGroup, req_data).then(
            (result) => {
                return Promise.resolve(result);
            },
            (errorObj) => {
                this._logger.error('ContentDetailResult get error', errorObj);
                this.showContent = 'EMPTY';
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );
    }


}
