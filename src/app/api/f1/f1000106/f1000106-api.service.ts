/**
 * F1000106-OTP裝置申請
 * 取得"OTP裝置認證識別碼"
 *
 * result	變更結果
 *  0-通過, 1-表示失敗，需由Failure element取得錯誤代碼及訊息。
 * OtpIdentity	OTP裝置認證識別碼
 */
import { Injectable } from '@angular/core';
import { F1000106ReqBody } from './f1000106-req';
import { F1000106ResBody } from './f1000106-res';
import { ApiBase } from '@base/api/api-base.class';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { PadUtil } from '@shared/util/formate/string/pad-util';

@Injectable()
export class F1000106ApiService extends ApiBase<F1000106ReqBody, F1000106ResBody> {

  constructor(
    public telegram: TelegramService<F1000106ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'F1000106');
  }

  send(req: F1000106ReqBody) {
    // 參數處理
    let data: F1000106ReqBody = new F1000106ReqBody();
    const custId = this.authService.getCustId();
    if (custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    if (!req.hasOwnProperty('password') || req.password == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = custId;
    data.password = req.password;

    return this.doEncode(data).then(
      (send_data) => {
        return super.send(send_data).then(
          (resObj) => {
            let output = {
              status: false,
              msg: 'ERROR.RSP_FORMATE_ERROR',
              OtpIdentity: ''
            };
            let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
            if (!jsonObj.hasOwnProperty('result') || jsonObj['result'] != '0') {
              // 驗證失敗
              return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.CHECK_ERROR'
              });
            }

            output.OtpIdentity = this._formateService.checkField(jsonObj, 'OtpIdentity');

            if (output.OtpIdentity == '') {
              // 驗證失敗: 原native未處理相關邏輯，為避免問題，僅提示訊息
              // return Promise.reject({
              //     title: 'ERROR.CHECK_ERROR',
              //     content: 'PG_OTP.ERROR.EMPTY_OTP_IDENTITY'
              // });
              output.msg = 'PG_OTP.ERROR.EMPTY_OTP_IDENTITY';
              output.OtpIdentity = '';
            } else {
              output.status = true;
              output.msg = '';
            }
            this.authService.updateTmpInfo({ BoundID: '2', BIND_identity: output.OtpIdentity });
            return Promise.resolve(output);
          },
          (errorObj) => {
            return Promise.reject(errorObj);
          }
        );
      },
      (errorObj2) => {
        return Promise.reject(errorObj2);
      }
    );


  }


  private doEncode(data: F1000106ReqBody): Promise<any> {
    return this.authService.digitalEnvelop(data.password).then(
      (encodeStr) => {
        data.password = encodeStr.value;
        return Promise.resolve(data);
      },
      (errorObj2) => {
        return Promise.reject(errorObj2);
      }
    );
  }

}
