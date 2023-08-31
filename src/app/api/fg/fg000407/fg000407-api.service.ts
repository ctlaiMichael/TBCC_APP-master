import { Injectable } from '@angular/core';
import { FG000407ReqBody } from './fg000407-req';
import { FG000407ResBody } from './fg000407-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class FG000407ApiService extends ApiBase<FG000407ReqBody, FG000407ResBody> {

  constructor(public telegram: TelegramService<FG000407ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService) {
    super(telegram, errorHandler, 'FG000407');
  }
  send(data: FG000407ReqBody): Promise<any> {
    /**
     * 共同行銷
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
          status: false,
          info_data: {},
          trnsRsltCode: '',
          hostCode: '',
          hostCodeMsg: '',
          title: 'ERROR.TITLE',
          msg: 'ERROR.DEFAULT',
          classType: 'error',
        };
        //參照native code: FG000407.java
        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
        const transRes = TransactionApiUtil.modifyResponse(resObj);
        output.status = transRes.status;
        output.title = transRes.title;
        output.msg = transRes.msg;
        output.classType = transRes.classType;
        output.trnsRsltCode = transRes.trnsRsltCode;
        output.hostCode = transRes.hostCode;
        output.hostCodeMsg = transRes.hostCodeMsg;
        output.info_data = telegram;

       
        if (telegram.hasOwnProperty('result') && telegram['result'] == '0') {
          output.status = true;
          output.info_data = telegram;
          return Promise.resolve(output);
        } else {
          // output.msg = "處理error";
          return Promise.reject(output);
        }
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



