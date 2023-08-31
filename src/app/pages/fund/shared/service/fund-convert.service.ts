/**
 * 基金轉換
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000501ApiService } from '@api/fi/fI000501/fI000501-api.service';


@Injectable()

export class FundConvertService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000501: FI000501ApiService
    ) {
    }

    getAccount(set_type, set_data): Promise<any> {
        this._logger.step('FUND', 'set_data:', set_data);
        this._logger.step('FUND', 'set_type:', set_type);
        return this.fi000501.getData(set_type, set_data).then(
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
