import { Injectable } from '@angular/core';
import { FF000103ReqBody } from './ff000103-req';
import { FF000103ResBody } from './ff000103-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FF000103ApiService extends ApiBase<FF000103ReqBody, FF000103ResBody> {

  constructor(public telegram: TelegramService<FF000103ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService) {
    super(telegram, errorHandler, 'FF000103');
  }

  send(data: FF000103ReqBody): Promise<any> {
    /**
     * EMAIL查詢
     */

    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = userData.custId;
    return super.send(data).then(
      (resObj) => {
        let output = {
          status: true,
          email: '',
          msg: ''
        };
        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
        if (telegram.hasOwnProperty('email') && telegram['email'] != '') {
          output.status = true;
          output.email = telegram.email;
          return Promise.resolve(output);
        } else {
          output.msg=resObj.msg;
          return Promise.reject(output);
        }

      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



