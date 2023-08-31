
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000101ReqBody } from './fb000101-req';
import { FB000101ResBody } from './fb000101-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000101ApiService extends ApiBase<FB000101ReqBody, FB000101ResBody> {

    constructor(public telegram: TelegramService<FB000101ResBody>,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FB000101');
    }


    send(data: FB000101ReqBody): Promise<any> {
        // 參數處理
        /**
         * 台幣存款利率
         */
        return super.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    dataTime: '',
                    data: {
                        currentRatesData: [], // 一般活期存款
                        savingsRatesData: [], // 一般儲蓄存款
                        fixRateData: []       // 一般定期存款
                    }
                };

                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};


                if (telegram.hasOwnProperty('date')) {
                    output.dataTime = telegram.date;
                }
                if (telegram.hasOwnProperty('currentRates') &&  telegram['currentRates'] 
                    && telegram['currentRates'].hasOwnProperty('detail')
                ) {
                    output.data.currentRatesData = this.modifyTransArray(telegram.currentRates['detail']);
                }
                if (telegram.hasOwnProperty('savingsRates') &&  telegram['savingsRates'] 
                    && telegram['savingsRates'].hasOwnProperty('detail')
                ) {
                    output.data.savingsRatesData = this.modifyTransArray(telegram.savingsRates['detail']);
                }
                if (telegram.hasOwnProperty('fixRates') &&  telegram['fixRates'] 
                    && telegram['fixRates'].hasOwnProperty('detail')
                ) {
                    output.data.fixRateData = this.modifyTransArray(telegram.fixRates['detail']);
                }
                output.info_data = telegram;
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