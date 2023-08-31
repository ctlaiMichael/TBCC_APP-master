import { Injectable } from '@angular/core';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { NumberCheckUtil } from '@shared/util/check/number-check-util';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';
import { UserChgUtil } from '@shared/util/check/data/userchg-check-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FG000407ApiService } from '@api/fg/fg000407/fg000407-api.service';
import { FG000407ReqBody } from '@api/fg/fg000407/fg000407-req';
@Injectable()
export class commonMarketService {

    constructor(
        private fg000407: FG000407ApiService,
    ) { }



    /**
     * 送電文
     * @param componentobj 
     */
    sendData(agreeOrNot,fnctId): Promise<any> {
        let output = {
            info_data: {},
            msg: 'error',
            status: false
        };


        let reqObj = new FG000407ReqBody();
        if (agreeOrNot) {
            reqObj = {
                "custId": "",
                "fnctId": fnctId,
                "marketingType": agreeOrNot
            };
        };

        return this.fg000407.send(reqObj).then(
            (jsonObj) => {
                let output = jsonObj;
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    //共同興蕭成功
                    output.status = true;
                    output.info_data = jsonObj.info_data
                    return Promise.resolve(output);
                } else {
                    output.status = false;
                    return Promise.reject(output);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        )


    }



}









