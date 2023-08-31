import { FormateService } from '@shared/formate/formate.service';
import { Injectable } from '@angular/core';
import { F9000406ResBody } from './f9000406-res';
import { F9000406ReqBody } from './f9000406-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F9000406ApiService extends ApiBase<F9000406ReqBody, F9000406ResBody> {

  constructor(
    public telegram: TelegramService<F9000406ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    public _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'F9000406');

  }

  getData(req: any): Promise<any> {
    let data = new F9000406ReqBody();
    const usercustId = this.authService.getCustId();
    data.custId = usercustId;


    let output = {
      status: false,
      title: 'ERROR.TITLE',
      msg: 'ERROR.DEFAULT',
      result: '',
      trnsRsltCode: '',
      hostCode: '',
      hostCodeMsg: '',
      classType: 'error',
      info_data: {}
    };

    return super.send(data).then(
      (resObj) => {

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.log('jsonObj:', jsonObj);

        output.result = jsonObj.result;
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
        output.info_data['trnsRsltCode'] = output.trnsRsltCode;
        output.info_data['hostCode'] = output.hostCode;
        output.info_data['hostCodeMsg'] = output.hostCodeMsg;
        this._logger.log("api return output:", this._formateService.transClone(output));
        output.status = true;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}




