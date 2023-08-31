/**
 * 交易控制碼
 */
import { Injectable } from '@angular/core';
import { FH000203ResBody } from './fh000203-res';
import { FH000203ReqBody } from './fh000203-req';
import { FH000203Res } from './fh000203-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FH000203ApiService extends ApiBase<FH000203ReqBody, FH000203Res> {
    constructor(public telegram: TelegramService<FH000203Res>,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FH000203');
    }

    send(data: FH000203ReqBody): Promise<any> {
        return super.send(data).then(
            (resObj) => {
                let output = {
                    data: '',
                    msg: ''
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                if (jsonObj.hasOwnProperty('trnsToken') && !(jsonObj['trnsToken'] == '') && !!jsonObj['trnsToken']) {
                    output['data'] = jsonObj['trnsToken'];
                    return Promise.resolve(output);
                } else {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY'
                    });
                }
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }
}
