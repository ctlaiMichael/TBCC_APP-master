/**
 * gold now
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { GoldService } from '@pages/financial/shared/service/gold.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FB000701ApiService } from '@api/fb/fb000701/fb000701-api.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-gold-now-page',
    templateUrl: './gold-now-page.component.html',
    styles: [

    ],
    providers: [GoldService]
})
export class GoldNowPageComponent implements OnInit {


    showData = false;
    info_data = {};
    dataTime = '';
    gold_bankbook = {};
    gold_bar = [];

    constructor(
        private _logger: Logger
        , private _mainService: GoldService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {
        this.getData().then(
            (result) => {
                // this._logger.step('Financial', 'result', result);
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            }
            , (errorObje) => {
                // this._logger.step('Financial', 'errorObje', errorObje);
                this.navgator.pageInitEnd(); // 取得資料後顯示頁面
            }
        );
    }

    /**
     * 即時牌價刷新
     */
    onRegetEvent() {
        this.getData(true);
    }



    private getData(reget?: boolean): Promise<any> {
        let set_data = {};
        let option = {
            background: false,
            reget: (reget) ? true : false
        };
        return this._mainService.getGoldTodayData(set_data, option).then(
            (result) => {
                this.info_data = result.info_data;
                this.gold_bankbook = result.data1;
                this.gold_bar = result.data2;
                // this.dataTime = DateUtil.transDate(result.date + result.time);
                this.dataTime = result.dataTime;
                this.showData = true;
                return Promise.resolve();

            }
            , (errorObj) => {
                this.showData = false;
                errorObj['type'] = 'message';
                // errorObj['type'] = 'dialog'; // 有開歷史牌價才是dialog
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );

    }

}
