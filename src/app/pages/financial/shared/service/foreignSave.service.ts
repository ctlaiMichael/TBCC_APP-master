/**
 * 外幣放款利率
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { FB000103ApiService } from '@api/fb/fb000103/fb000103-api.service';
import { FB000103ReqBody } from '@api/fb/fb000103/fb000103-req';
import { CacheService } from '@core/system/cache/cache.service';

@Injectable()
export class ForeignSaveService {
    /**
     * 參數處理
     */
    constructor(
        private _logger: Logger
        , private _htPipeService: FormateService
        , private fb000103: FB000103ApiService
        , private _cacheService: CacheService
    ) {
    }



    /**
     * 外幣放款利率
     * 向service取得資料
     */
    public getData(option?: Object): Promise<any> {
        const cache_key = 'foreignSave';
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
        let req_data = new FB000103ReqBody();
        return this.fb000103.send(req_data).then(
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


