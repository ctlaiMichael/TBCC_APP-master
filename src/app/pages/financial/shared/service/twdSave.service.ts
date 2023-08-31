/**
 * 台幣存款利率
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { FB000101ApiService } from '@api/fb/fb000101/fb000101-api.service';
import { FB000101ReqBody } from '@api/fb/fb000101/fb000101-req';
import { CacheService } from '@core/system/cache/cache.service';
@Injectable()
export class TwdSaveService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        , private _htPipeService: FormateService
        , private fb000101: FB000101ApiService
        , private _cacheService: CacheService
    ) {
    }

    /**
     * select切換狀態
     */
    getSetType(get_type?: string) {
        let output: any = {
            'list': {},
            'data': []
        };
        let set_data = [
            { id: 'currentRatesData', name: '一般活期存款(年息)' }
            , { id: 'savingsRatesData', name: '一般儲蓄存款(年息)' }
            , { id: 'fixRateData', name: '一般定期存款(年息)' }
        ];
        output.data = set_data;
        set_data.forEach((item) => {
            if (!item.hasOwnProperty('id')) {
                return false;
            }
            output.list[item.id] = item;
        });
        // this._logger.step('Financial', this._htPipeService.transClone(output)); 克隆
        if (typeof get_type !== 'undefined') {
            output = (output.hasOwnProperty(get_type)) ? output[get_type] : null;
        }
        return output;
    }


    /**
     * 台幣存款利率
     * 向service取得資料
     */
    public getData(set_data: any, option?: Object): Promise<any> {
        const cache_key = 'twdSave';
        const cache_check = this._cacheService.checkCacheSet(option);

        if (!cache_check.reget) {
            // 背景取得，首頁請求，取cache
            const cache_data = this._cacheService.load(cache_key);
            if (cache_data) {
                return Promise.resolve(cache_data);
            }
        } else {
            // 取得最新的
            this._cacheService.remove(cache_key);
        }

        let req_data = new FB000101ReqBody();
        return this.fb000101.send(req_data).then(
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

}


