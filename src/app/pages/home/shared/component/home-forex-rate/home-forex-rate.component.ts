/**
 * 外幣匯率即時牌價box
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { UserHomeService } from '@pages/home/shared/service/user-home.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-home-forex-rate',
    templateUrl: './home-forex-rate.component.html',
    providers: [UserHomeService]
})
export class HomeForexRateComponent implements OnInit {
    /**
     * 參數處理
     */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showData = false;
    dataTime = '';
    data = [];

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _mainService: UserHomeService
    ) {
    }


    ngOnInit() {
        this._mainService.getForexRate().then(
            (resObj) => {
                this.dataTime = resObj.dataTime;
                if (resObj.data.length > 0) {
                    this.data = resObj.data.slice(0, 4);
                }
                this.showData = true;
                this.onBackPageData(resObj);
            },
            (errorObj) => {
                this.onErrorBackEvent(errorObj);
            }
        );

    }

    onClickEvent() {
        this.navgator.push('exchange'); // 前往外幣匯率
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item) {
        let output = {
            'page': 'forex',
            'type': 'success',
            'data': item
        };
        this._logger.step('HomePage', 'forex-rate', item);
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'forex',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'forex-rate', error_obj);
        this.errorPageEmit.emit(output);
    }

}

