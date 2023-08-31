/**
 * 基金轉換-申請確認
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000511ApiService } from '@api/fi/fI000511/fI000511-api.service';


@Injectable()

export class ConvertApplyMultipleService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000511: FI000511ApiService
    ) {
    }

    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        this._logger.step('FUND', 'req:', req);
        return this.fi000511.getData(req, page, sort).then(
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
