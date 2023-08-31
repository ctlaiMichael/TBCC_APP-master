/**
 *線上申貸 分行原案件(共用)
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000402ApiService } from "@api/f9/f9000402/f9000402-api.service";

@Injectable()

export class BranchCaseService {

    constructor(
        private _logger: Logger,
        private f9000402: F9000402ApiService
    ) { }
    //查詢原案件、分行
    public getBranchCode(req: any, page?: number, option?: Object): Promise<any> {
        return this.f9000402.getData(req, page).then(
            (success) => {
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }
    //可增貸金額 = 額度-現欠餘額
    public getIncreaseAmount(setData) {
        this._logger.log("service, setData:", setData);
        let output = [];
        setData.forEach(item => {
            let temp = parseInt(item['outLarpm']) - parseInt(item['outLaral']);
            item['increaseAmount'] = temp.toString();
            output.push(item);
        });
        this._logger.log("service, output:", output);
        return output;
    }
}