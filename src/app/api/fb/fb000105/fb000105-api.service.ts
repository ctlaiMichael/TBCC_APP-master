
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000105ReqBody } from './fb000105-req';
import { FB000105ResBody } from './fb000105-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000105ApiService extends ApiBase<FB000105ReqBody, FB000105ResBody> {

    constructor(public telegram: TelegramService<FB000105ResBody>,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FB000105');
    }
    /**
     * 外幣放款利率
     */

    send(data: FB000105ReqBody): Promise<any> {
        // 參數處理

        return super.send(data).then(
            (resObj) => {

                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    dataTime: '',
                    searchTime: '',
                    data: []
                };


                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
                let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
                if (telegramHeader.hasOwnProperty('responseTime')) {
                    output.searchTime = telegramHeader.responseTime;
                }

                output.status = true;
                output.msg = '';
                output.info_data = telegram;
                if (telegram.hasOwnProperty('txDate')) {
                    output.dataTime = telegram.txDate;
                };
       
                if (telegram['FRLoanRates'] && telegram.hasOwnProperty('FRLoanRates') && telegram['FRLoanRates'].hasOwnProperty('detail')
                ) {
                    output.data =  this.modifyTransArray(telegram.FRLoanRates['detail']);
                }

                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}