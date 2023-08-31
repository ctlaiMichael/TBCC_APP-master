
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000106ReqBody } from './fb000106-req';
import { FB000106ResBody } from './fb000106-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000106ApiService extends ApiBase<FB000106ReqBody, FB000106ResBody> {

    constructor(public telegram: TelegramService<FB000106ResBody>,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FB000106');
    }
    /**
     * 票券利率
     */

    send(data: FB000106ReqBody): Promise<any> {
        // 參數處理

        return super.send(data).then(
            (resObj) => {

                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    dataTime: '',
                    data: []
                };

                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

           
                if (telegram.hasOwnProperty('txDate')) {
                    output.dataTime = telegram['txDate'];
                }
    
                if (telegram.hasOwnProperty('details') &&  telegram['details']
                    && telegram['details'].hasOwnProperty('detail')
                    &&  telegram['details']['detail']
                ) {
                    output.data = this.modifyTransArray(telegram['details']['detail']);
                }
                if (output.data.length <= 0) {
                    output.msg = 'ERROR.EMPTY';
                    return Promise.reject(output);
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