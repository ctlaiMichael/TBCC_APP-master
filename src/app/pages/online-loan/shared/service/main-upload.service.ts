/**
 *線上申貸 證明文件上傳(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000408ApiService } from "@api/f9/f9000408/f9000408-api.service";

@Injectable()

export class MainUploadService {

    constructor(
        private _logger: Logger,
        private f9000408: F9000408ApiService
    ) { }
    //證明文件上傳(含往來分行設定)
    public sendUpLoad(req): Promise<any> {
        this._logger.log("into sendUpLoad");
        return this.f9000408.sendData(req).then(
            (success) => {
                this._logger.log("408 success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("408 failed:", failed);
                return Promise.resolve(failed);
            }
        );
    }
}