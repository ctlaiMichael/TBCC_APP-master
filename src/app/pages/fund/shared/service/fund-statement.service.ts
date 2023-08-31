/**
 * 信託對帳單查詢/寄送

 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { FI000707ApiService } from '@api/fi/fi000707/fi000707-api.service';
import { FI000708ApiService } from '@api/fi/fi000708/fi000708-api.service';
import { FI000707ReqBody } from '@api/fi/fi000707/fi000707-req';
import { FI000708ReqBody } from '@api/fi/fi000708/fi000708-req';

@Injectable()

export class FundStatementService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private fi000707: FI000707ApiService,
        private fi000708: FI000708ApiService
    ) {
    }



    /**
    *   取得寄送方式
    */
    getMailOut(): Promise<any> {
        let output = {
            status: false,
            msg: 'Error',
            mailOut: '',
            trnsToken:''
        };
        let reqObj = new FI000707ReqBody();
        reqObj = {
            "custId": ""
        }

        return this.fi000707.send(reqObj).then(
            (jsonObj) => {
                this._logger.log('jsonObj',jsonObj);
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true
                    && jsonObj.hasOwnProperty('trnsToken') &&  jsonObj.hasOwnProperty('mailOut')
                ) {
                    //查詢成功
                    output.status = true;
                    output.mailOut = jsonObj.mailOut;
                    output.trnsToken=jsonObj.trnsToken;
                    return Promise.resolve(output);
                } else {
                    return Promise.reject(jsonObj);
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        )
    }
    /**
     * fi000708
     */
    onSend(mailOut, trnsToken, security): Promise<any> {
        let output = {
            status: false,
            msg: 'Error',
            mailOut: ''
        };
        this._logger.log('componentObject', mailOut,trnsToken);
        let reqObj = new FI000708ReqBody();
        if (mailOut!='' && trnsToken!='') {
            reqObj = {
                "custId": "",
                "mailOut": mailOut,
                "trnsToken": trnsToken
            }
        }

        let reqHeader = {
            header: security.securityResult.headerObj
        };
        return this.fi000708.send(reqObj, reqHeader).then(
            (jsonObj) => {
                this._logger.log('jsonObjjsonObj', jsonObj);
                if (jsonObj.hasOwnProperty('status') && jsonObj.status == true) {
                    //查詢成功
                    output.mailOut = jsonObj.mailOut;
                    output.status = true;
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
