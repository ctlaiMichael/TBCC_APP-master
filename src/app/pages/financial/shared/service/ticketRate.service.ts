/**
 *票券利率Service
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { FB000106ApiService } from '@api/fb/fb000106/fb000106-api.service';
import { FB000106ReqBody } from '@api/fb/fb000106/fb000106-req';
import { CacheService } from '@core/system/cache/cache.service';
import { Tels } from '@conf/tel';

@Injectable()
export class TicketRateService {
    /**
     * 參數處理
     */
    constructor(
        private _logger: Logger,
        private _htPipeService: FormateService
        , private fb000106: FB000106ApiService
        , private _cacheService: CacheService
    ) { }

    /**
     * 選單資料設定
     */
    public getMenuData() {
        let output = [];
        output.push({
            id: 'second',
            name: 'PG_FINANCIAL.TICKET_RATE.FIELD.TITLE1', // 次級市場(年息)%
            menu: {
                'left': 'PG_FINANCIAL.TICKET_RATE.FIELD.SUB_TITLE1', // 買入(含RS)
                'right': 'PG_FINANCIAL.TICKET_RATE.FIELD.SUB_TITLE2' // 賣出(含R/P)
            },
            data_key: {
                'left': 'buyRate',
                'right': 'sellRate'
            }
        });
        output.push({
            id: 'first',
            name: 'PG_FINANCIAL.TICKET_RATE.FIELD.TITLE2', // 初級市場(年息)%
            menu: {
                'left': 'PG_FINANCIAL.TICKET_RATE.FIELD.SUB_TITLE3', // CP2
                'right': 'PG_FINANCIAL.TICKET_RATE.FIELD.SUB_TITLE4' // BA
            },
            data_key: {
                'left': 'cp2Rate',
                'right': 'baRate'
            }
        });
        return output;
    }



    /**
     * 票券利率
     */
    public getData(option?: Object): Promise<any> {
        const cache_key = 'ticketRate';
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
        let req_data = new FB000106ReqBody();
        return this.fb000106.send(req_data).then(
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
