/**
 *  簽約對保
 */
import { Injectable} from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000401ApiService } from "@api/f9/f9000401/f9000401-api.service";
import { F9000501ApiService } from "@api/f9/f9000501/f9000501-api.service";
import { F9000502ApiService } from "@api/f9/f9000502/f9000502-api.service";
import { F9000403ApiService } from "@api/f9/f9000403/f9000403-api.service";
import { F9000504ApiService } from "@api/f9/f9000504/f9000504-api.service";

@Injectable()

export class SignProtectService {

    constructor(
        private _logger: Logger,
        private f9000501: F9000501ApiService,
        private f9000401: F9000401ApiService,
        private f9000502: F9000502ApiService,
        private f9000403: F9000403ApiService,
        private f9000504: F9000504ApiService
    ) { }

    // 查詢案件進度(f9000501)
    public getQuery(req: any, page?: number, option?: Object): Promise<any> {
        return this.f9000501.getData(req, page).then(
            (success) => {
                this._logger.log("f9000501 api success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("f9000501 api failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    // 個人基本資料查詢(f9000401)
    public getCustInfo(): Promise<any> {
        return this.f9000401.getData().then(
            (success) => {
                this._logger.error("f9000401 api success", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.error("f9000401 api failed", failed);
                return Promise.reject(failed);
            }
        );
    }

    // 期間與利率及是否為員工(f9000504)
    public getOtherInfo(reqData: any): Promise<any> {
        return this.f9000504.getData(reqData).then(
            (success) => {
                this._logger.error("f9000504 api success", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.error("f9000504 api failed", failed);
                return Promise.reject(failed);
            }
        );
    }



    //預設日期為當天
    public setToday() {
        let today = new Date;
        let y = (today.getFullYear()).toString(); //西元年
        let m = (today.getMonth() + 1).toString();
        if (parseInt(m) < 10) {
            m = '0' + m;
        }
        let d = today.getDate().toString();
        let enrollDate;
        if (parseInt(d) < 10) {
            d = '0' + d;
        }
        enrollDate = y + '-' + m + '-' + d;
        return enrollDate;
    }


    // 申請對保(f9000502)
    public sendDate(custInfo: any, reqHeader?: any): Promise<any> {
        return this.f9000502.sendData(custInfo, reqHeader).then(
            (success) => {
                this._logger.error("f9000502 api success", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.error("f9000502 api failed", failed);
                return Promise.reject(failed);
            }
        );
    }

    // 取得借款契約草稿(f9000403)
    public getTerm(setData):Promise<any> {
        return this.f9000403.getData(setData).then(
            (success) => {
                this._logger.log("f9000403API success:",success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("f9000403API failed:",failed);
                return Promise.reject(failed);
            }
        );
    }
}