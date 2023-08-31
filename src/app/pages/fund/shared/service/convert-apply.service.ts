/**
 * 基金轉換-申請確認
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000507ApiService } from '@api/fi/fI000507/fI000507-api.service';


@Injectable()

export class ConvertApplyService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000507: FI000507ApiService
    ) {
    }

    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        this._logger.step('FUND', 'req:', req);
        return this.fi000507.getData(req, page, sort).then(
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
