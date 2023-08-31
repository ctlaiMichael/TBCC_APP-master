import { Injectable } from '@angular/core';
import { FG000401ReqBody } from './fg000401-req';
import { FG000401ResBody } from './fg000401-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FG000401ApiService extends ApiBase<FG000401ReqBody, FG000401ResBody> {

  constructor(public telegram: TelegramService<FG000401ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService) {
    super(telegram, errorHandler, 'FG000401');
  }
  send(data: FG000401ReqBody): Promise<any> {
    /**
     * 註銷約定轉入帳號查詢
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
          status: false,
          requestTime: '',
          msg: 'Error',
          data: [],
        }

        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

        let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};

        if (telegramHeader.hasOwnProperty('requestTime')) {
          output.requestTime = (telegramHeader.requestTime).replace(/-/g, "").replace(/T/g, "").replace(/:/g, "").substring(0, 14);
        }

        if (telegram['details'] != null && telegram['details'] != 'undefined'
          && telegram['details'].hasOwnProperty('detail') && telegram['details']['detail'] != null) {
          output.data = this.modifyTransArray(telegram['details']['detail']);
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



