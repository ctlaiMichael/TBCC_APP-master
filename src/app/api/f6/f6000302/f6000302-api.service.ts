// 外匯綜活轉綜定利率查詢
import { Injectable } from '@angular/core';
import { F6000302ResBody } from './f6000302-res';
import { F6000302ReqBody } from './f6000302-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F6000302ApiService extends ApiBase<F6000302ReqBody, F6000302ResBody> {
    constructor(public telegram: TelegramService<F6000302ResBody>, public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'F6000302');
    }

    getData(set_data): Promise<any> {
        let output = {
            status: false,
            msg: 'Error',
            requestTime: '',
            rate: '',
            info_data: {},
        };

        let data = new F6000302ReqBody();
        if (set_data && set_data.hasOwnProperty('currency') && set_data.hasOwnProperty('transfrTimes') &&
             set_data.currency != '' && set_data.hasOwnProperty('transfrTimes')
            ) {
            data.currency = set_data.currency;
            data.transfrTimes = set_data.transfrTimes;
            data.trnsfrOutAccnt = set_data.trnsfrOutAccnt;
            data.transfrAmount = set_data.transfrAmount;
            data.autoTransCode = set_data.autoTransCode;
            data.computeIntrstType = set_data.computeIntrstType;
        }else {
            return Promise.reject(output);
        };

        return this.send(data).then(
            (resObj) => {


                let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
                if (telegramHeader.hasOwnProperty('requestTime')) {
                    output.requestTime = telegramHeader.requestTime;
                }

                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

                if (jsonObj.hasOwnProperty('intrstRate')) {
                    output.info_data = jsonObj;
                    output.rate = jsonObj.intrstRate;
                    output.status = true;
                    output.msg = '';
                };

                return Promise.resolve(output);
            },
            (errorObj) => {

                return Promise.reject(errorObj);
            }
        );
    }
}
