/**
 * 台幣存款利率
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { TwdSaveService } from '@pages/financial/shared/service/twdSave.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
    selector: 'app-twd-save-page',
    templateUrl: './twd-save-page.component.html',
    styleUrls: [],
    providers: [TwdSaveService]
})
export class TwdSavePageComponent implements OnInit {
    /**
     * 參數
     */
    info_data: any = {};
    dataTime = ''; // data time
    nowType: any = {};
    dataType = [];
    fullData = {
        currentRatesData: [],
        savingsRatesData: [],
        fixRateData: []
    };
    showData = false;
    data = [];

    constructor(
        private _logger: Logger
        , private _mainService: TwdSaveService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this.dataType = this._mainService.getSetType('data');
        this.getData({}).then(
            () => {
                this.onChangeType(this.dataType[0]);
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            },
            () => {
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            }
        );
    }


    /**
     * 改變select選擇時
     * @param menu
     */
    onChangeType(menu?: Object) {
        this._logger.step('Financial', 'onChangeType1', menu);
        if (typeof menu !== 'undefined') {
            this.nowType = menu;
        }
        this._logger.step('Financial', 'onChangeType2', this.data, menu);
        this.showData = false;
        this.data = [];
        if (this.nowType.hasOwnProperty('id') && this.fullData.hasOwnProperty(this.nowType['id'])
            && this.fullData[this.nowType['id']].length > 0
        ) {
            this.showData = true;
            this.data = this.fullData[this.nowType['id']];
        }
    }



    private getData(set_data: any): Promise<any> {
        return this._mainService.getData(set_data).then(
            (result) => {
                this._logger.step('Financial', 'getData', result);
                this.info_data = result.info_data;
                this.dataTime = result.dataTime;
                this.fullData = result.data;
                return Promise.resolve();
            }
            , (errorObj) => {

                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );

    }


}
