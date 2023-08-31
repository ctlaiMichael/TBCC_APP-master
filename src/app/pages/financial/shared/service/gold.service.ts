/**
 * 金融資訊-黃金存摺
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FB000701ApiService } from '@api/fb/fb000701/fb000701-api.service';
import { FB000701ReqBody } from '@api/fb/fb000701/fb000701-req';
import { FB000702ApiService } from '@api/fb/fb000702/fb000702-api.service';
import { FB000702ReqBody } from '@api/fb/fb000702/fb000702-req';
import { CacheService } from '@core/system/cache/cache.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';

@Injectable()
export class GoldService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定
    constructor(
        private _logger: Logger,
        private _checkService: CheckService,
        private _cacheService: CacheService,
        private fb000701: FB000701ApiService,
        private fb000702: FB000702ApiService,
        private _formateService: FormateService

    ) {
    }

    // tab切換
    public getMenuData() {
        let output = [];
        output.push({
            id: 'now',
            name: '即時牌價'
        });
        output.push({
            id: 'history',
            name: '歷史牌價'
        });

        return output;
    }

    // 期間切換
    public getDayMenuData() {
        let output = [];
        output.push({
            day: '近一日'
        });
        output.push({
            day: '近3月'
        });
        output.push({
            day: '近6月'
        });
        output.push({
            day: '自訂'
        });
        return output;
    }



    /**
     * 取得黃金存摺即時牌價
     */
    public getGoldTodayData(set_data: any, option?: Object): Promise<any> {

        const cache_key = 'gold';
        const cache_check = this._cacheService.checkCacheSet(option);
        if (cache_check.reget) {
            // 強制取得最新的
            this._cacheService.remove(cache_key);
        } else {
            // 取cache
            const cache_data = this._cacheService.load(cache_key);
            if (cache_data) {
                return Promise.resolve(cache_data);
            }
        }

        return this.fb000701.getData(set_data, cache_check.background).then(
            (jsonObj) => {
                let output = jsonObj;
                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, output, cache_option);
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }


    /**
     * 查歷史牌價
     * @param set_date 查詢日期key
     */
    public getHistoryData(set_data): Promise<any> {
        return this.fb000702.send(set_data).then(
            (jsonObj) => {
                // console.log('history', jsonObj);
                let output = jsonObj;
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }



    /**
             * 取得日期設定條件
             * @param set_key 日期條件編號
             */
    getDateSet(set_key: string): Object {
        if (this.dateCheckList.hasOwnProperty(set_key)) {
            return this._formateService.transClone(this.dateCheckList[set_key]);
        } else {
            return {};
        }
    }


    public setDateCheck(set_key: string) {
        // 最多只可查詢本月與前2個月
        let set_obj: any = {
            baseDate: 'today', // 基礎日
            rangeType: 'M', // "查詢範圍類型" M OR D
            rangeNum: '12', // 查詢範圍限制
            rangeDate: '', // 比較日
            rangeBaseDate: '01' // 當rangeType為自訂時，的基礎日期
        };
        switch (set_key) {
            case '1D': // 前一日
                // search(now=2019/04/22): 2019/04/21~2019/04/21
                set_obj['rangeType'] = 'D';
                set_obj['rangeNum'] = '1';
                set_obj['rangeBaseDate'] = '';
                break;
            case '3M': // 最近1月
                // search(now=2019/04/22): 2019/03/22~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '3';
                set_obj['rangeBaseDate'] = '';
                break;
            case '6M': // 最近1月
                // search(now=2019/04/22): 2019/03/22~2019/04/22
                set_obj['rangeType'] = 'M';
                set_obj['rangeNum'] = '6';
                set_obj['rangeBaseDate'] = '';
                break;
            case 'other':
                let yd = new Date(new Date().setDate(new Date().getDate() - 1));
                let yd_yyyy = yd.getFullYear();
                let yd_mm = yd.getMonth();
                yd_mm = yd_mm + 1;
                let yd_dd = yd.getDate();
                set_obj['baseDate'] = yd_yyyy + '-' +
                    ((yd_mm > 9) ? yd_mm : ('0' + yd_mm)) + '-' +
                    ((yd_dd > 9) ? yd_dd : ('0' + yd_dd));
                break;
        }

        const dateType = 'strict';
        const date_data = this._checkService.getDateSet(set_obj, dateType);

        let output = {
            startDate: '',
            endDate: ''
        };
        if (set_key !== 'custom') {
            output.startDate = date_data.minDate;
            output.endDate = date_data.maxDate;
        }
        this.dateCheckList[set_key] = date_data;
        return output;
    }


}






