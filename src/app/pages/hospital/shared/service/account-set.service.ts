/**
 *扣款(常用)帳號設定
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FH000101ApiService } from '@api/fh/fh000101/fh000101-api.service';
import { FH000102ApiService } from '@api/fh/fh000102/fh000102-api.service';

@Injectable()

export class AccountSetService {
    constructor(
        private _logger: Logger,
        private fh000101: FH000101ApiService,
        private fh000102: FH000102ApiService,
    ) { }

    getData(set_data): Promise<any> {
        this._logger.log("set_data:",set_data);
        return this.fh000101.getData(set_data).then(
            (sucess)=> {
                this._logger.log(sucess);
                this._logger.log("SSSSSSSSSSSSSSS");
                return Promise.resolve(sucess);
            },
            (failed)=> {
                this._logger.log(failed);
                this._logger.log("FFFFFFFFFFFFFFF");
                return Promise.reject(failed);
            }
        )
    }


    getAccountSet(set_data): Promise<any> {
        this._logger.log("set_data:",set_data);
        return this.fh000102.getData(set_data).then(
            (sucess)=> {
                this._logger.log(sucess);
                this._logger.log("SSSSSSSSSSSSSSS");
                return Promise.resolve(sucess);
            },
            (failed)=> {
                this._logger.log(failed);
                this._logger.log("FFFFFFFFFFFFFFF");
                return Promise.reject(failed);
            }
        )
    }
}