/**
 *基金庫存總覽
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FI000303ApiService } from "@api/fi/fI000303/fI000303-api.service";
import { CacheService } from "@core/system/cache/cache.service";

@Injectable()

export class FundRichOverviewService {
    constructor(
        private _logger: Logger,
        private fi000303: FI000303ApiService
        , private _cacheService: CacheService
    ) { }

    getData(set_data): Promise<any> {
        let option = {
            'background': false,
            'reget': false
        }
        const cache_key = 'fund-rich-stock';
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
        return this.fi000303.getData(set_data).then(
            (sucess) => {
                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, sucess, cache_option);
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }
}


