/**
 * 基金轉換(預約)-確認結果
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000510ApiService } from '@api/fi/fI000510/fI000510-api.service';


@Injectable()

export class ConvertResultReserveService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000510: FI000510ApiService
    ) {
    }

    getData(req: object, security?: any, page?: number, sort?: Array<any>): Promise<any> {
        this._logger.step('FUND', 'req:', req);
        let reqHeader = {
            header: security.securityResult.headerObj
          };
        return this.fi000510.getData(req, page, sort, reqHeader).then(
            (sucess) => {
                this._logger.step('FUND', sucess);
                this._logger.step('FUND', 'SSSSSSSSSSSSSSS');
                return Promise.resolve(sucess);
            },
            (failed) => {
                this._logger.step('FUND', failed);
                this._logger.step('FUND', 'FFFFFFFFFFFFFFF');
                return Promise.reject(failed);
            }
        );
    }
}
