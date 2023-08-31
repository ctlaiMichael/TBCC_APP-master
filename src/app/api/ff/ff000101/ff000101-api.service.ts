import { Injectable } from '@angular/core';
import { FF000101ReqBody } from './ff000101-req';
import { FF000101ResBody } from './ff000101-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FF000101ApiService extends ApiBase<FF000101ReqBody, FF000101ResBody> {

  constructor(public telegram: TelegramService<FF000101ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService) {
    super(telegram, errorHandler, 'FF000101');
  }
  send(data: FF000101ReqBody): Promise<any> {
    /**
     * 通訊地址查詢
     */
    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    };
    data.custId = userData.custId;
    return super.send(data).then(
      (resObj) => {
        let output = {
          info_data: {},
          status: false,
          msg: 'Error',
          zipCode: '',
          address: '',
          tel: ''
        }
        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

        output.info_data = telegram;
        if (telegram.hasOwnProperty('zipCode')) {
          output.zipCode = telegram['zipCode'];
        }
        if (telegram.hasOwnProperty('address')
        ) {
          output.address = telegram['address'];
        }
        if (telegram.hasOwnProperty('tel')) {
          output.tel = telegram['tel'];
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



