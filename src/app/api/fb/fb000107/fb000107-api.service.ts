/**
 * 票券利率
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000107ReqBody } from './fb000107-req';
import { FB000107ResBody } from './fb000107-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramOption } from '@core/telegram/telegram-option';

@Injectable()
export class FB000107ApiService extends ApiBase<FB000107ReqBody, FB000107ResBody> {

    constructor(public telegram: TelegramService<FB000107ResBody>,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FB000107');
    }
    /**
     * 債券利率
     */

    getData(set_data?: Object, background?: boolean): Promise<any> {
        // 參數處理
        let option: TelegramOption = new TelegramOption();
        if (background === true) {
            option.background = true;
        }
        let data: FB000107ReqBody = new FB000107ReqBody();


        return super.send(data).then(
            (resObj) => {

                let output = {
                    status: false,
                    msg: 'ERROR.DEFAULT',
                    info_data: {},
                    dataTime: '',
                    data: []
                };
                let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

                output.info_data = telegram;
                if (telegram.hasOwnProperty('txDate')) {
                    output.dataTime = telegram.txDate;
                }

                let check_obj = this.checkObjectList(telegram, 'details.detail');
                if (typeof check_obj !== 'undefined') {
                    output.data = this.modifyTransArray(check_obj);
                    delete output.info_data['details'];
                }

                if (output.data.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY'
                    });
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