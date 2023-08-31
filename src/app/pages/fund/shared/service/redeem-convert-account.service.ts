/**
 * 基金轉換
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000502ApiService } from '@api/fi/fI000502/fI000502-api.service';


@Injectable()

export class RedeemConvertAccountService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000502: FI000502ApiService
    ) {
    }

    getAccount(req: object): Promise<any> {
        return this.fi000502.getData(req).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }
}
