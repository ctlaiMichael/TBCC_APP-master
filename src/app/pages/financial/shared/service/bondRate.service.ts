/**
 * 債券利率
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { FB000107ApiService } from '@api/fb/fb000107/fb000107-api.service';
import { CacheService } from '@core/system/cache/cache.service';
import { Tels } from '@conf/tel';

@Injectable()
export class BondRateService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        , private _htPipeService: FormateService
        , private fb000107: FB000107ApiService
        , private _cacheService: CacheService
    ) {
    }



    /**
     * 債券利率
     */
    public getData(option?: Object): Promise<any> {
        const cache_key = 'bondRate';
        const cache_check = this._cacheService.checkCacheSet(option);

        if (!cache_check.reget) {
            // 取cache
            const cache_data = this._cacheService.load(cache_key);
            if (cache_data) {
                return Promise.resolve(cache_data);
            }
        } else {
            // 取得最新的
            this._cacheService.remove(cache_key);
        }

        let req_data = {};
        return this.fb000107.getData(req_data, cache_check.background).then(
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

    getTel() {
        let output = {
            'name': '',
            'show_tel': '',
            'tel': ''
        };
        if (typeof Tels['financial_ticket'] !== 'undefined' && Tels['financial_ticket']) {
            output = Tels['financial_ticket'];
        }
        return output;
    }

}


