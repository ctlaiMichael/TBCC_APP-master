import { Injectable } from '@angular/core';
import { F6000201ResBody } from './f6000201-res';
import { F6000201ReqBody } from './f6000201-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F6000201ApiService extends ApiBase<F6000201ReqBody, F6000201ResBody> {
    constructor(public telegram: TelegramService<F6000201ResBody>,
        public errorHandler: HandleErrorService,
        private authService: AuthService) {
        super(telegram, errorHandler, 'F6000201');
    }
    /**
     * F6000201-綜定存歸戶查詢
     */
    send(): Promise<any> {
        let data: F6000201ReqBody = new F6000201ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId=userData.custId;
        return super.send(data).then(
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
                // if (output.data.length <= 0) {
                //     return Promise.reject({
                //         title: 'ERROR.TITLE',
                //         content: 'ERROR.EMPTY'
                //     });
                // }
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
