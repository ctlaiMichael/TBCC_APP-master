/**
 *基金庫存明細
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FI000102ApiService } from "@api/fi/fI000102/fI000102-api.service";
import { CacheService } from "@core/system/cache/cache.service";

@Injectable()

export class FundStockDetailService {
    constructor(
        private _logger: Logger,
        private fi000102: FI000102ApiService
        , private _cacheService: CacheService
    ) { }

    getData(set_data,page?: number, sort?: Array<any>, option?: Object, pageSize?: string | number): Promise<any> {
        const cache_check = this._cacheService.checkPaginatorCach('fund-stock-detail', page, sort, option, pageSize);
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }
        return this.fi000102.getData(set_data, page).then(
            (sucess)=> {
                let cache_option = this._cacheService.getCacheSet(cache_key);
                this._cacheService.save(cache_key, sucess, cache_option);
                return Promise.resolve(sucess);
            },
            (failed)=> {
                return Promise.reject(failed);
            }
        );
    }
}
