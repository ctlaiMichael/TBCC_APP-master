import { Injectable } from '@angular/core';
import { FH000101ResBody } from './fh000101-res';
import { FH000101ReqBody } from './fh000101-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FH000101ApiService extends ApiBase<FH000101ReqBody, FH000101ResBody> {
  constructor(public telegram: TelegramService<FH000101ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService) {
    super(telegram, errorHandler, 'FH000101');
  }

  getData(set_data: FH000101ReqBody): Promise<any> {
    let output = {
      status: false,
      msg: 'Error',
      info_data: {},
      data: [],
    };
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    let data = new FH000101ReqBody();
    data.custId = userData.custId; 

    return super.send(data).then(
      (resObj) => {

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.msg = '';
        output.info_data = jsonObj;
        if (
          !jsonObj.hasOwnProperty('custId') ||
          !jsonObj.hasOwnProperty('trnsAcctNo') 
        ) {
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.RSP_FORMATE_ERROR'
          });
        }
        if (jsonObj.hasOwnProperty("trnsOutAccts") &&  jsonObj['trnsOutAccts']
          && jsonObj['trnsOutAccts'].hasOwnProperty("detail")
          &&  jsonObj['trnsOutAccts']['detail']
        ) {
          output.data = this.modifyTransArray(jsonObj['trnsOutAccts']['detail']);
        }
        if (output.data.length <= 0) {
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.EMPTY'
          });
        }
        output.status = true;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}
