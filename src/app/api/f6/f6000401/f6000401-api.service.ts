// F6000401:外匯綜定存歸戶查詢
import { Injectable } from '@angular/core';
import { F6000401ResBody } from './f6000401-res';
import { F6000401ReqBody } from './f6000401-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F6000401ApiService extends ApiBase<F6000401ReqBody, F6000401ResBody> {
    constructor(
        public telegram: TelegramService<F6000401ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
    ) {
        super(telegram, errorHandler, 'F6000401');
    }


    getData(): Promise<any> {
        // 參數處理
        let data: F6000401ReqBody = new F6000401ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId; // user info;

        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    data: [],
                    requestTime: ''
                };
                
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                output.info_data = jsonObj;
         
                if (jsonObj.hasOwnProperty('details') && jsonObj['details']
                    && jsonObj['details'].hasOwnProperty('detail') && jsonObj['details']['detail']
                ) {
                    output.data = this.modifyTransArray(jsonObj.details['detail']);
                }

                if (output.data.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY'
                    });
                }


                let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
                if (telegramHeader.hasOwnProperty('requestTime')) {
                    output.requestTime = telegramHeader.requestTime;
                }
                output.status = true;
                output.msg = '';


                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }



}
