/**
 * 黃金即時牌價box
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { UserHomeService } from '@pages/home/shared/service/user-home.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
    selector: 'app-home-gold',
    templateUrl: './home-gold.component.html',
    providers: [UserHomeService]
})
export class HomeGoldComponent implements OnInit {
    /**
     * 參數處理
     */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showData = false;
    dataTime = '';
    data1 = {
        name: '',
        sell: '',
        buy: ''
    };
    data2 = [];

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _mainService: UserHomeService
    ) {
    }


    ngOnInit() {
        this._mainService.getGold().then(
            (resObj) => {
                this.dataTime = resObj.dataTime;
                this.data1 = resObj.data1;
                // data2顯示數
                if (resObj.data2.length > 0) {
                    this.data2 = resObj.data2.slice(0, 2);
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
        this.navgator.push('gold'); // 前往黃金牌價
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item) {
        let output = {
            'page': 'gold',
            'type': 'success',
            'data': item
        };
        this._logger.step('HomePage', 'gold', item);
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'gold',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'gold', error_obj);
        this.errorPageEmit.emit(output);
    }

}

