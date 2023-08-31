import { Injectable } from '@angular/core';
import { FG000601ReqBody } from './fg000601-req';
import { FG000601ResBody } from './fg000601-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { PadUtil } from '@shared/util/formate/string/pad-util';
@Injectable()
export class FG000601ApiService extends ApiBase<FG000601ReqBody, FG000601ResBody> {

  constructor(public telegram: TelegramService<FG000601ResBody>,
    public errorHandler: HandleErrorService
    , private authService: AuthService
    , private _logger: Logger) {
    super(telegram, errorHandler, 'FG000601');
  }
  send(data: FG000601ReqBody): Promise<any> {
    /**
     * SSL密碼變更
     */
    let output = {
      status: false,
      result: '1',
      msg: ''
    };
    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = userData.custId;
    return this.doEncode(data).then(
      (endodeObj) => {
        if (!endodeObj.oldConnPswd || !endodeObj.newConnPswd) {
          return Promise.reject({
            title: '解密失敗',
            contnet: ''
          });
        }
        return super.send(data).then(
          (resObj) => {

            let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

            if (telegram.hasOwnProperty('result') && telegram['result'] == '0') {
              output.status = true;
              return Promise.resolve(output);
            } else {
              output.msg = "處理失敗";
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
    )
  }
  private doEncode(data: FG000601ReqBody): Promise<any> {
    data.oldConnPswd=PadUtil.padRight(data.oldConnPswd,16," ");
    data.newConnPswd=PadUtil.padRight(data.newConnPswd,16," ");
    return this.authService.digitalEnvelop(data.oldConnPswd).then(
      (oldConnPswd1) => {
        return this.authService.digitalEnvelop(data.newConnPswd).then(
          (newConnPswd2) => {
            data.oldConnPswd = oldConnPswd1.value;
            data.newConnPswd = newConnPswd2.value;
            return Promise.resolve(data);
          },
          (errorObj1) => {
            return Promise.reject(errorObj1);
          }
        );
      },
      (errorObj2) => {
        return Promise.reject(errorObj2);
      }
    );



  }

}
