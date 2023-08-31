import { Injectable } from '@angular/core';
import { FF000102ReqBody } from './ff000102-req';
import { FF000102ResBody } from './ff000102-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FF000102ApiService extends ApiBase<FF000102ReqBody, FF000102ResBody> {

  constructor(public telegram: TelegramService<FF000102ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService) {
    super(telegram, errorHandler, 'FF000102');
  }
  send(data: FF000102ReqBody, reqHeader): Promise<any> {
    /**
     * 通訊地址變更
     */
    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    };
    data.custId = userData.custId;
    return super.send(data, reqHeader).then(
      (resObj) => {
        let output = {
          status: false,
          msg: ''
        };
        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};


        if (telegram.hasOwnProperty('result') && telegram['result'] == '0') {
          output.status = true;
          return Promise.resolve(output);
        } else {
          output.msg = resObj.msg;
          return Promise.reject(output);
        }
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



