import { Injectable } from '@angular/core';

import { AuthService } from '@core/auth/auth.service';
import { FK000103ApiService } from '@api/fk/fk000103/fk000103-api.service';
import { FK000103ReqBody } from '@api/fk/fk000103/fk000103-req';
import { FK000102ApiService } from '@api/fk/fk000102/fk000102-api.service';
import { FK000102ReqBody } from '@api/fk/fk000102/fk000102-req';
import { FK000101ApiService } from '@api/fk/fk000101/fk000101-api.service';
import { FK000101ReqBody } from '@api/fk/fk000101/fk000101-req';

// import { LangTransService } from 'app/shared/pipe/langTransPipe/lang-trans.service';

@Injectable()
export class LostReportService {

    constructor(
        private _authService: AuthService,
        private fk000103: FK000103ApiService,
        private fk000102: FK000102ApiService,
        private fk000101: FK000101ApiService
    ) { }

    sendData(req): Promise<any> {
        // 
        let reqObj = new FK000103ReqBody();
        return this._authService.digitalEnvelop(req.password).then(
            (crypto_S) => {
                reqObj.lostType = req.lostType;
                reqObj.accountNo = req.accountNo;
                reqObj.replacementWay = req.replacementWay;
                reqObj.sendTo = req.sendTo;
                reqObj.password = crypto_S.value;
                // 
                return this.fk000103.send(reqObj).then(
                    (result_S) => {
                        // 
                        return Promise.resolve(result_S);
                    }, (result_F) => {
                        return Promise.reject(result_F);
                    }
                );
            }, (crypto_F) => {
                return Promise.reject(crypto_F);
            }
        );
    }

    getLostUserInfo() {
        let reqObj = new FK000101ReqBody();
        return this.fk000101.send(reqObj).then(
            (jsonObj) => {
                return Promise.resolve(jsonObj);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }

        );
    }

    getAccountList(req) {

        let reqObj = new FK000102ReqBody;
        if (req.hasOwnProperty('lostType')) {
            reqObj.lostType = req.lostType;
            return this.fk000102.send(reqObj).then(
                (jsonObj) => {
                    return Promise.resolve(jsonObj);
                }, (errorObj) => {
                    return Promise.reject(errorObj);
                }

            );
        } else {
            // 參數錯誤
            let ERROR = {
                message: '參數錯誤',
                content: '參數錯誤',
                status: false,
                title: '',
                type: 'message'
            };
            return Promise.reject(ERROR);
        }

    }

}









