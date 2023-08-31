import { Injectable } from '@angular/core';
import { FH000102ResBody } from './fh000102-res';
import { FH000102ReqBody } from './fh000102-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FH000102ApiService extends ApiBase<FH000102ReqBody, FH000102ResBody> {
  constructor(public telegram: TelegramService<FH000102ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FH000102');
  }

  getData(set_data: FH000102ReqBody): Promise<any> {
    let output = {
      status: false,
      msg: 'Error',
      info_data: {},
    };
    let data = new FH000102ReqBody();
    data.custId = set_data.custId;
    data.account = set_data.account; 

    return super.send(data).then(
      (resObj) => {

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.msg = '';
        if (
          !jsonObj.hasOwnProperty('custId') ||
          jsonObj['custId'] == '' || 
          !jsonObj.hasOwnProperty('result') ||
          jsonObj['result'] == ''
        ) {
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.RSP_FORMATE_ERROR'
          });
        }
        output.info_data = jsonObj;
        output.status = true;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}
