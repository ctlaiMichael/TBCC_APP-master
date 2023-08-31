/**
 * 基金轉換-申請確認
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000509ApiService } from '@api/fi/fI000509/fI000509-api.service';


@Injectable()

export class ConvertApplyReserveService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000509: FI000509ApiService
    ) {
    }

    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        this._logger.step('FUND', 'req:', req);
        return this.fi000509.getData(req, page, sort).then(
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
