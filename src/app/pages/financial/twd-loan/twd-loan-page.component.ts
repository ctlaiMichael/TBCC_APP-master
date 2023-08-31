/**
 * 台幣放款利率
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { TwdLoanService } from '@pages/financial/shared/service/twdLoan.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-twd-loan-page',
    templateUrl: './twd-loan-page.component.html',
    styleUrls: [],
    providers: [TwdLoanService]
})
export class TwdLoanPageComponent implements OnInit {
    /**
     * 參數
     */

    info_data: any = {};
    dataTime = ''; // data time
    nowType: any = {};
    fullData = {
        loanAddRate1: ''  // 基準放款指數(本行)
        , loanAddRate2: ''  // 基準放款指數(原農民銀行)
        , CreditCardRate: ''  // 信用卡循環信用利率
        , BaseRate: ''  // 基準利率
        , BaseRateM: ''  // 月基準利率
        , FDRate: ''  // 定儲指數利率
        , FDRateM: ''  // 定儲指數月指標利率
        , BaseRate2: ''  // 基準利率(原農民銀行)
        , FDRate2: ''  // 定儲指數利率(原農民銀行)
    };
    showData = false;
    data = [];

    constructor(
        private _logger: Logger
        , private _mainService: TwdLoanService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this.getData().then(
            () => {
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            },
            () => {
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            }
        );

    }



    private getData(): Promise<any> {
        return this._mainService.getData().then(
            (result) => {
                
                this.info_data = result.info_data;
                this.dataTime = result.dataTime;
                this.fullData.loanAddRate1 = result.data.loanAddRate1;
                this.fullData.loanAddRate2 = result.data.loanAddRate2;
                this.fullData.CreditCardRate = result.data.CreditCardRate;
                this.fullData.BaseRate = result.data.BaseRate;
                this.fullData.BaseRateM = result.data.BaseRateM;
                this.fullData.FDRate = result.data.FDRate;
                this.fullData.FDRateM = result.data.FDRateM;
                this.fullData.BaseRate2 = result.data.BaseRate2;
                this.fullData.FDRate2 = result.data.FDRate2;
                this.showData = true;
                return Promise.resolve();
            }
            , (errorObj) => {
                this.showData = false;
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );

    }


}
