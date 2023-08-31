/**
 * F1000107-OTP裝置申請
 *
 * result	變更結果
 *  0-通過, 1-表示失敗，需由Failure element取得錯誤代碼及訊息。
 * errorCode:
 *    ERR10701 驗證碼錯誤，停留原畫面
 *    ERR10702 驗證碼失效，離開畫面
 */
import { Injectable } from '@angular/core';
import { F1000107ReqBody } from './f1000107-req';
import { F1000107ResBody } from './f1000107-res';
import { ApiBase } from '@base/api/api-base.class';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class F1000107ApiService extends ApiBase<F1000107ReqBody, F1000107ResBody> {

  constructor(
    public telegram: TelegramService<F1000107ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'F1000107');
  }

  send(req: F1000107ReqBody) {
    // 參數處理
    let data: F1000107ReqBody = new F1000107ReqBody();
    const custId = this.authService.getCustId();
    if (custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    if (!req.hasOwnProperty('OtpIdentity') || req.OtpIdentity == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = custId;
    data.OtpIdentity = req.OtpIdentity;
    if (req.hasOwnProperty('commonName') || req.commonName !== '') {
      data.commonName = req.commonName;
    }

    return super.send(data).then(
      (resObj) => {
        let output = {
          status: false,
          msg: 'ERROR.RSP_FORMATE_ERROR',
          dataTime: '',
          date: '' // 交易完成日期
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        if (!jsonObj.hasOwnProperty('result') || jsonObj['result'] != '0') {
          // 驗證失敗
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.CHECK_ERROR'
          });
        }

        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.date = this._formateService.transDate(output.dataTime, 'date');

        output.status = true;
        output.msg = '';
        // 申請成功
        this.authService.updateTmpInfo({ BoundID: '4', BIND_identity: '' });
        return Promise.resolve(output);
      },
      (errorObj) => {
        errorObj['_check'] = {
          stop: true, // 是否終止
          lock: false // 是否鎖定
        };
        if (errorObj.hasOwnProperty('resultCode') && errorObj['resultCode']) {
          if (errorObj['resultCode'] == 'ERR10701') {
            // 驗證碼錯誤，停留原畫面
            errorObj['_check']['stop'] = false;
            errorObj['_check']['lock'] = false;
          } else if (errorObj['resultCode'] == 'ERR10702') {
            // 驗證碼失效，離開畫面
            errorObj['_check']['stop'] = true;
            errorObj['_check']['lock'] = true;
            // 若連續三次輸入密碼錯誤。
            this.authService.updateTmpInfo({ BoundID: '3' });
          }
        }
        return Promise.reject(errorObj);
      }
    );
  }

}
