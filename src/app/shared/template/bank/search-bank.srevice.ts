/**
 * 銀行搜尋
 */
import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { F4000103ReqBody } from '@api/f4/f4000103/f4000103-req';
import { FormateService } from '@shared/formate/formate.service';
import { CacheService } from '@core/system/cache/cache.service';

@Injectable()
export class SearchBankService {

    constructor(
        private _logger: Logger
        , private f4000103: F4000103ApiService
        , private formateService:FormateService
		, private _cacheService: CacheService

    ) { }


    //============================================================取得銀行列表
    getBank(): Promise<any> {
        // let output = {
        //     status: false,
        //     msg: 'Error',
        //     data: []
        // };


        let option = {
			'background': false,
			'reget': false
		}

        const cache_key = 'bank-code';
		const cache_check = this._cacheService.checkCacheSet(option);
		if (cache_check.reget) {
			// 強制取得最新的
            this._logger.log('remove',cache_key);
			this._cacheService.remove(cache_key);
		} else {
			// 取cache
            const cache_data = this._cacheService.load(cache_key);
            this._logger.log('else',cache_data);
			if (cache_data) {
				return Promise.resolve(cache_data);
			}
        }
        
        let reqObj = new F4000103ReqBody();

        return this.f4000103.send(reqObj).then(
            (jsonObj) => {
                let cache_option = this._cacheService.getCacheSet(cache_key);
				this._cacheService.save(cache_key, jsonObj, cache_option);
                this._logger.log('4000103res', jsonObj);
        
                return Promise.resolve(jsonObj);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        )
    }

    /**
     * 提供查詢代碼或名稱
     * @param query 
     * @param data 
     */
    searchData(query: string, data: Array<any>) {
        let output = [];

        query = this.formateService.transEmpty(query);
        let re = new RegExp(query);
        if (query === '') {
            return data;
        }
        data.forEach(elem=>{
            let allName=elem['bankCode']+elem['bankName'];
            if(re.test(allName)){
                output.push(elem);
            };
        });
        return output;
    }



}


