/**
 * 基金申購
 * 
 * 
 * 
 *
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000401ApiService } from "@api/fi/fI000401/fI000401-api.service";


@Injectable()

export class FundPurchaseTagService {
    /**
     * 參數處理
     */
    private dateCheckList = {}; // 日期檢核設定

    constructor(
        private _logger: Logger,
        private fi000401: FI000401ApiService
    ) {
    }

    getAccount(set_data): Promise<any> {
        return this.fi000401.getData(set_data).then(
            (sucess)=> {
                return Promise.resolve(sucess);
            },
            (failed)=> {
                return Promise.reject(failed);
            }
        )
    }
}
