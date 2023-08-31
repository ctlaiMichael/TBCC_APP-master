import { Injectable } from '@angular/core';
import { FG000402ReqBody } from './fg000402-req';
import { FG000402ResBody } from './fg000402-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class FG000402ApiService extends ApiBase<FG000402ReqBody, FG000402ResBody> {

  constructor(public telegram: TelegramService<FG000402ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService) {
    super(telegram, errorHandler, 'FG000402');
  }
  send(data: FG000402ReqBody, reqHeader): Promise<any> {

    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = userData.custId;

    /**
     * 約定轉入帳號註銷
     */
    return super.send(data, reqHeader).then(
      (resObj) => {
        let output = {
          info_data: {},
          status: false,
          trnsRsltCode: '',
          hostCode: '',
          hostCodeMsg: '',
          title: 'ERROR.TITLE',
          msg: 'ERROR.DEFAULT',
          classType: 'error'
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
        return Promise.resolve(output);

      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



