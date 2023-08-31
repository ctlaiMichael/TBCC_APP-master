/**
 *基金庫存明細
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FI000304ApiService } from "@api/fi/fI000304/fI000304-api.service";
import { FI000305ApiService } from "@api/fi/fI000305/fI000305-api.service";
import { CacheService } from "@core/system/cache/cache.service";

@Injectable()

export class FundRichDetailService {
    constructor(
        private _logger: Logger,
        private fi000304: FI000304ApiService,
        private fi000305: FI000305ApiService
        , private _cacheService: CacheService
    ) { }

    getData(set_data, page?: number, sort?: Array<any>, option?: Object, pageSize?: string | number): Promise<any> {
        const cache_check = this._cacheService.checkPaginatorCach('fund-rich-stock-detail', page, sort, option, pageSize);
        const cache_key = cache_check.cache_key;
        if (cache_check.status) {
            return Promise.resolve(cache_check.data);
        }

        return this.fi000304.getData(set_data, page).then(
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

    getQueryData(set_query): Promise<any> {
        return this.fi000305.getData(set_query).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        )
    }
}