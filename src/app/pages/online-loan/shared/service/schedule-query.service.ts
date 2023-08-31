/**
 *進度查詢
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000501ApiService } from "@api/f9/f9000501/f9000501-api.service";

@Injectable()

export class ScheduleQueryService {

    constructor(
        private _logger: Logger,
        private f9000501: F9000501ApiService
    ) { }

    //查詢案件進度(缺api，先忽略)
    public getQuery(req: any, page?: number, option?: Object):Promise<any> {
        return this.f9000501.getData(req,page).then(
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