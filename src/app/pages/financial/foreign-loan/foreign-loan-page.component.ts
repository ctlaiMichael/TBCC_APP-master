/**
 * 外幣放款利率
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { ForeignLoanService } from '@pages/financial/shared/service/foreignLoan.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-foreign-loan-page',
    templateUrl: './foreign-loan-page.component.html',
    styleUrls: [],
    providers: [ForeignLoanService]
})
export class ForeignLoanPageComponent implements OnInit {
    /**
     * 參數
     */
    info_data: any = {};
    dataTime = ''; // 電文回傳資料時間
    searchTime = '';
    fullData = {

    };
    showData = false;
    data = [];

    constructor(
        private _logger: Logger
        , private _mainService: ForeignLoanService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this.getData().then(
            () => {
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
                // this._logger.step('Financial', 'data', this.data);
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
                this.searchTime = result.searchTime;
                this.data = result.data;
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
