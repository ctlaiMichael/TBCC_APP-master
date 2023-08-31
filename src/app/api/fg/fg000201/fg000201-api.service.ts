import { Injectable } from '@angular/core';
import { FG000201ReqBody } from './fg000201-req';
import { FG000201ResBody } from './fg000201-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { F1000102ApiService } from '@api/f1/f1000102/f1000102-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FG000201ApiService extends ApiBase<FG000201ReqBody, FG000201ResBody> {

  constructor(
    public telegram: TelegramService<FG000201ResBody>
    , public errorHandler: HandleErrorService
    , private F1000102: F1000102ApiService
    , private authService: AuthService
    , private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FG000201');
  }

  send(data: FG000201ReqBody): Promise<any> {
    /**
     * 網路連線代號變更
     */
    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = userData.custId;
    data.newConnId=data.newConnId.toUpperCase();
    data.oldConnId=data.oldConnId.toUpperCase();
    return this.doEncode(data).then(
      (endodeObj) => {
        if (!endodeObj.password) {
          return Promise.reject({
            title: '解密失敗',
            contnet: ''
          });
        }
        return super.send(endodeObj).then(
          (resObj) => {
            let output = {
              info_data: {},
              status: false,
              result: '1',
              msg: ''
            };

            let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

            if (telegram.hasOwnProperty('result') && telegram['result'] == '0') {
              output.status = true;
              output.result = '0';
              output.info_data = telegram;
              return Promise.resolve(output);
            } else {
              output.msg = endodeObj.msg;
              return Promise.reject(output);
            }
          },
          (errorObj) => {
            return Promise.reject(errorObj);
          }
        );
      },
      (encodeErrorObj) => {
        return Promise.reject({
          title: '解密失敗',
          contnet: ''
        });
      }
    );


  }
  private doEncode(data: FG000201ReqBody): Promise<any> {

    return this.authService.digitalEnvelop(data.password).then(
      (oldConnPswd1) => {
        this._logger.step('USER-SET', 'USER-SET-digitalEnvelop');
        data.password = oldConnPswd1.value;
        return Promise.resolve(data);
      },
      (errorObj2) => {
        return Promise.reject(errorObj2);
      }
    );



  }


}


