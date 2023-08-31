/**
 * 理財、轉介人員查詢
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FI000502ApiService } from '@api/fi/fI000502/fI000502-api.service';
import { FI000713ReqBody } from '@api/fi/fI000713/fi000713-req';
import { FI000713ApiService } from '@api/fi/fI000713/fI000713-api.service';


@Injectable()

export class SearchStaffService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private fi000713: FI000713ApiService
    ) {
    }

    getStaff(branchId): Promise<any> {
        //this._logger.error("into getStaff");
        let reqData = new FI000713ReqBody();
        reqData.buId = branchId;
        //this._logger.error("buId", reqData.buId, branchId);
        return this.fi000713.getData(reqData).then(
            (success) => {
                //this._logger.error("success:", success);
                // this.mainData['list'] = success.data;
                // let modify_data = this.formateBranch(success.data);
                // success['_modify'] = modify_data;
                // this.mainData = modify_data;
                return Promise.resolve(success);
            },
            (failed) => {
                //this._logger.error("failed:", failed);
                //this._handleError.handleError(failed);
                return Promise.reject(failed);
            }
        );
    }
}
