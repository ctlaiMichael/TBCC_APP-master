import { Injectable } from '@angular/core';
import { FI000707ReqBody } from './fi000707-req';
import { FI000707ResBody } from './fi000707-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FI000707ApiService extends ApiBase<FI000707ReqBody, FI000707ResBody> {

  constructor(public telegram: TelegramService<FI000707ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    public _formateService: FormateService) {
    super(telegram, errorHandler, 'FI000707');
  }
  send(data: FI000707ReqBody): Promise<any> {


    /**
     * 信託對帳單查詢
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
          trnsRsltCode: '',
          hostCode: '',
          hostCodeMsg: '',
          title: 'ERROR.TITLE',
          msg: 'ERROR.DEFAULT',
          classType: 'error',
          info_data: {},
          mailOut: '',
          trnsToken:''
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

        if (telegram.hasOwnProperty('mailOut') && telegram.hasOwnProperty('trnsToken')) {
          output.status = true;
          output.info_data = telegram;
          output.mailOut = this._formateService.checkField(telegram, 'mailOut');
          output.trnsToken=this._formateService.checkField(telegram, 'trnsToken');
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



