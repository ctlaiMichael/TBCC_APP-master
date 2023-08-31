/**
 * 債券利率
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { BondRateService } from '@pages/financial/shared/service/bondRate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-bond-rate-page',
    templateUrl: './bond-rate-page.component.html',
    styleUrls: [],
    providers: [BondRateService]
})
export class BondRatePageComponent implements OnInit {

    info_data: any = {};
    dataTime = '';
    showData = false;
    data = [];
    tel = {
        'name': '',
        'show_tel': '',
        'tel': ''
    };

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _mainService: BondRateService
        , private navgator: NavgatorService
    ) {
    }

    ngOnInit() {
        this.tel = this._mainService.getTel();
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
                this.dataTime = result.dataTime;
                this.info_data = result.info_data;
                this.data = result.data;
                this.showData = true;
                return Promise.resolve();
            }
            ,
            (errorObj) => {
                this.showData = false;
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                return Promise.reject(errorObj);
            }
        );
    }
}
