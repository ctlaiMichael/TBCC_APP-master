/**
 * 帳戶資訊
 * TW: 台幣
 * FOREX: 外幣
 * GOLD: 黃金存摺
 */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { TranslateService } from '@ngx-translate/core';
import { CheckService } from '@shared/check/check.service';

@Component({
    selector: 'app-date-range-search',
    templateUrl: './date-range-search.component.html',
    styleUrls: [],

})
export class DateRangeSearchComponent implements OnInit, OnChanges {
    /**
     * 參數處理
     */
    @Input() show;
    @Input() dateObj;
    @Input() infoData: Array<any>;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showInfo = false;
    showInfoData: Array<any>;
    startDate = {
        default: '',
        min: '',
        max: '',
        data: '',
        error: ''
    };
    endDate = {
        default: '',
        min: '',
        max: '',
        data: '',
        error: ''
    };
    showError = {
        error: false,
        msg: ''
    };

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private translate: TranslateService
    ) {
    }


    ngOnInit() {
        this._modifyInfo().then((data) => {
            this.showInfoData = data;
            this.showInfo = true;
        });
        this._modifyDate();
    }

    ngOnChanges() {
        // if (this.startDate.data !== '' && this.endDate.data !== '') {
        //     this.showInfo = false;
        // }
    }


    /**
     * 查詢
     */
    onSearch() {
        let output = {
            startDate: '',
            endDate: ''
        };
        let check_data = this._checkService.checkDateRange([this.startDate.data, this.endDate.data], this.dateObj);
        if (!check_data.status) {
            this._logger.error(check_data);
            this.showError.error = true;
            this.showError.msg = check_data.msg;
            return false;
        }
        this.showError.error = false;
        this.showError.msg = '';
        output.startDate = this._formateService.transDate(this.startDate.data, 'date');
        output.endDate = this._formateService.transDate(this.endDate.data, 'date');
        this.onBackPageData(output);
    }

    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'search-box',
            'type': 'back',
            'data': item
        };
        this.backPageEmit.emit(output);
    }

    /**
     * 日期設定
     */
    private _modifyDate() {
        this._logger.step('DateRangeSearch', this.dateObj);
        const dateType = this._formateService.checkField(this.dateObj, 'check_type');
        const dateTypeSet = this._formateService.checkField(this.dateObj, 'check_set');
        const min_date = this._formateService.checkField(this.dateObj, 'minDate');
        const max_date = this._formateService.checkField(this.dateObj, 'maxDate');
        const default_date = this._formateService.checkField(this.dateObj, 'baseDate');
        let tmp_date = '';
        if (min_date !== '') {
            tmp_date = this._formateService.transDate(min_date, 'yyyy-MM-dd');
            this.startDate.min = tmp_date;
            this.endDate.min = tmp_date;
        }
        if (max_date !== '') {
            tmp_date = this._formateService.transDate(max_date, 'yyyy-MM-dd');
            this.startDate.max = tmp_date;
            this.endDate.max = tmp_date;
        }
        if (default_date !== '') {
            tmp_date = this._formateService.transDate(default_date, 'yyyy-MM-dd');
            this.startDate.default = tmp_date;
            this.endDate.default = tmp_date;
            this.startDate.data = tmp_date;
            this.endDate.data = tmp_date;
        }

        this._logger.step('DateRangeSearch', this.startDate, this.endDate);
    }

    /**
     * info Data整理
     */
    private _modifyInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            let data: Array<any> = [];
            if (typeof this.infoData !== 'undefined' && (this.infoData instanceof Array) && this.infoData.length > 0) {
                let arrayLength = this.infoData.length - 1;
                this.infoData.forEach((item, item_key) => {
                    this.translate.get(item).subscribe((val) => {
                        let text = (item_key + 1) + '.&nbsp;';
                        text += val;
                        data.push(text);
                        if (item_key === arrayLength) {
                            // This is the last one.
                            resolve(data);
                        }
                    });
                });
            } else {
                resolve(data);
            }
        });

    }

}

