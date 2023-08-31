import { Injectable } from '@angular/core';
import { F4000103ResBody } from './f4000103-res';
import { F4000103ReqBody } from './f4000103-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F4000103ApiService extends ApiBase<F4000103ReqBody, F4000103ResBody> {
  constructor(public telegram: TelegramService<F4000103ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'F4000103');
  }

    send(data: F4000103ReqBody): Promise<any> {
        return super.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    data: []
                };

                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                output.info_data = jsonObj;
                if (jsonObj.hasOwnProperty('details') && jsonObj['details']
                    && jsonObj['details'].hasOwnProperty('detail')
                    && jsonObj['details']['detail']
                ) {
                    output.data = this.modifyTransArray(jsonObj['details']['detail']);
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
