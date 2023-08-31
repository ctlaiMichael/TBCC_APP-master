/**
 *線上申貸 同意選單(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000403ApiService } from "@api/f9/f9000403/f9000403-api.service";

@Injectable()

export class AgreeTermService {

    constructor(
        private _logger: Logger,
        private f9000403: F9000403ApiService
    ) { }

    public getTerm(setData):Promise<any> {
        return this.f9000403.getData(setData).then(
            (success) => {
                this._logger.log("success:",success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed:",failed);
                return Promise.reject(failed);
            }
        );
    }
}