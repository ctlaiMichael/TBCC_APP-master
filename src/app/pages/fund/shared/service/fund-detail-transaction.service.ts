/**
 *基金交易明細查詢
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FI000103ApiService } from "@api/fi/fI000103/fI000103-api.service";

@Injectable()

export class FundDetailTransactionService {
    constructor(
        private _logger: Logger,
        private fi000103: FI000103ApiService
    ) { }

    getData(reqData: any,page: number): Promise<any> {
        return this.fi000103.getPageData(reqData,page).then(
            (sucess)=> {
                return Promise.resolve(sucess);
            },
            (failed)=> {
                return Promise.reject(failed);
            }
        )
    }
}


