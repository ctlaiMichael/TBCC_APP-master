import { Injectable } from '@angular/core';
import { FG000406ReqBody } from './fg000406-req';
import { FG000406ResBody } from './fg000406-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class FG000406ApiService extends ApiBase<FG000406ReqBody, FG000406ResBody> {

  constructor(
    public telegram: TelegramService<FG000406ResBody>,

    private authService: AuthService,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FG000406');
  }
  send(data: FG000406ReqBody, reqHeader): Promise<any> {
    /**
     * 新增約定轉入帳號
     */


    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = userData.custId;
    return super.send(data, reqHeader).then(
      (resObj) => {
        let output = {
          status: false,
          trnsRsltCode: '',
          hostCode: '',
          hostCodeMsg: '',
          title: 'ERROR.TITLE',
          msg: 'ERROR.DEFAULT',
          classType: 'error',
          info_data: {}
        };

        const transRes = TransactionApiUtil.modifyResponse(resObj);

        let telegram = transRes.body;
        output.status = transRes.status;
        output.title = transRes.title;
        output.msg = transRes.msg;
        output.classType = transRes.classType;
        output.trnsRsltCode = transRes.trnsRsltCode;
        output.hostCode = transRes.hostCode;
        output.hostCodeMsg = transRes.hostCodeMsg;
        output.info_data = telegram;
        // if (telegram.hasOwnProperty('trnsRsltCode') && telegram['trnsRsltCode'] == '4001') {

        return Promise.resolve(output);
        // } else {
        //   output.msg = "處理error";
        //   return Promise.reject(output);
        // }
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



