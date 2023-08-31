import { Injectable } from '@angular/core';
import { FG000403ReqBody } from './fg000403-req';
import { FG000403ResBody } from './fg000403-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FG000403ApiService extends ApiBase<FG000403ReqBody, FG000403ResBody> {

  constructor(public telegram: TelegramService<FG000403ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService) {
    super(telegram, errorHandler, 'FG000403');
  }

  send(data: FG000403ReqBody): Promise<any> {
    /**
     * 常用帳號查詢
     */
    let output = {
      status: false,
      msg: 'Error',
      dataTime: '',
      data: [],
    };
    //取身分證
    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = userData.custId;

    return super.send(data).then(
      (resObj) => {
        let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
        if (telegramHeader.hasOwnProperty('requestTime')) {
          output.dataTime = telegramHeader.requestTime;
        };

        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
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



