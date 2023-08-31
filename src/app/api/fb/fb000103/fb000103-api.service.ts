
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000103ReqBody } from './fb000103-req';
import { FB000103ResBody } from './fb000103-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000103ApiService extends ApiBase<FB000103ReqBody, FB000103ResBody> {

    constructor(public telegram: TelegramService<FB000103ResBody>,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FB000103');
    }

    /**
     * 外幣存款利率
     */
    send(data: FB000103ReqBody): Promise<any> {
        // 參數處理

        return super.send(data).then(
            (resObj) => {

                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    dataTime: '',
                    cardTime: '',
                    searchTime: '',
                    data: []
                };

                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

                let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
                if (telegramHeader.hasOwnProperty('responseTime')) {
                    output.searchTime = telegramHeader.responseTime;
                }

                if (telegram.hasOwnProperty('cardDate') && telegram.hasOwnProperty('cardTime')) {
                    output.dataTime = telegram.cardDate + telegram.cardTime;
                }

                if (telegram.hasOwnProperty('details') &&  telegram['details'] 
                    && telegram.details.hasOwnProperty('detail')
                    && telegram['details']['detail']
                ) {
                    // output.data = telegram['details']['detail'];
                    output.data = this.modifyTransArray(telegram['details']['detail']);
                }

                output.status = true;
                output.msg = '';
                output.info_data = telegram;
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}