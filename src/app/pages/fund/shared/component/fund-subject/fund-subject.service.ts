/**
 *基金投資標的Service
 */
import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FI000402ApiService } from "@api/fi/fI000402/fI000402-api.service";

@Injectable()

export class FundSubjectService {

    constructor(
        private _logger: Logger,
        private fi000402: FI000402ApiService
    ) { }

    // for理財金庫導轉比對資料
    public findFundData(target, fullData) {
        let targetData = null;
        let pooldata = '';
        //console.log(fullData);
        pooldata = fullData.data1;
        // if (target.selectfund == 'Y') {
        //     // data1
        //     pooldata = fullData.data1;
        // } else {
        //     // data2
        //     pooldata = fullData.data2;
        // }
        for (let i = 0; i < pooldata.length; i++) {
            //console.log(pooldata[i]);
            if (pooldata[i].hasOwnProperty('fundCode') && pooldata[i]['fundCode'] == target['fundId']) {
                // 取得資料回應

                targetData = pooldata[i];
            }
        }
        return targetData;
    }

    //取得醫院資料402電文
    public getSubject(set_type: any): Promise<any> {

        return this.fi000402.getData(set_type).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }
}
