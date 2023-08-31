/**
 * 外幣匯率
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CacheService } from '@core/system/cache/cache.service';
import { FB000201ApiService } from '@api/fb/fb000201/fb000201-api.service';
@Injectable()
export class ExchangeService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        , private _cacheService: CacheService
        , private _formateService: FormateService
        , private fb000201: FB000201ApiService
    ) {
    }

    // tab切換
    getMenuData() {
        let output = [];
        output.push({
            id: 'spot',
            name: '即期',
            menu: {
                'left': '幣別',
                'center': '買入',
                'right': '賣出'
            },
            data_key: {
                'left': 'currency',
                'center': 'spotBuy',
                'right': 'spotSell'
            }
        });
        output.push({
            id: 'cash',
            name: '現鈔',
            menu: {
                'left': '幣別',
                'center': '買入',
                'right': '賣出'
            },
            data_key: {
                'left': 'currency',
                'center': 'cashBuy',
                'right': 'cashSell'
            }
        });
        // 匯率試算，無問題再開啟
        output.push({
            id: 'count',
            name: '匯率試算',
            menu: {
                'left': '幣別',
                'center': '',
                'right': '匯率'
            },
            data_key: {
                'left': 'currency',
                // 'center':'cashBuy',
                'right': 'cashSell'
            }
        });
        return output;
    }


    /**
     * 外幣匯率資料
     * 向service取得資料
     */
    public getData(set_data?: any, option?: Object): Promise<any> {
        const cache_key = 'forex-rate';
        const cache_check = this._cacheService.checkCacheSet(option);
        if (cache_check.reget) {
            // 強制取得最新的
            this._cacheService.remove(cache_key);
        } else {
            // 取cache
            // const cache_data = this._cacheService.load(cache_key);
            // if (cache_data) {
            //     return Promise.resolve(cache_data);
            // }
        }

        return this.fb000201.getData(set_data, cache_check.background).then(
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
     * 匯率試算資料整理
     */
    onSortnewData(sort_data) {
        let rate_table = [];
        const defaultCurrency = {
            'country': 'TWD'
            , 'currecnyName': ''
            , 'buy': '1'
            , 'sell': '1'
            , 'money': ''
        };
        rate_table.push(defaultCurrency);
        sort_data.forEach(elem => {
            let country_name = elem['currency'];
            let tmp_data = {
                country: '',
                currency: '',
                currencyName: '',
                buy: '',
                sell: '',
                money: ''
            };
            tmp_data['country'] = country_name;
            tmp_data['currency'] = country_name;
            tmp_data['currencyName'] = elem['currencyName'];
            tmp_data['buy'] = elem['spotBuy'];
            tmp_data['sell'] = elem['spotSell'];
            tmp_data['money'] = elem['spotSell'];
            // rate_table[country_name]=tmp_data;
            rate_table.push(tmp_data);
        });
        return rate_table;
    }


}


