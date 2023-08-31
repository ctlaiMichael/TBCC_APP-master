import { Injectable } from '@angular/core';
import { FI000708ReqBody } from './fi000708-req';
import { FI000708ResBody } from './fi000708-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FI000708ApiService extends ApiBase<FI000708ReqBody, FI000708ResBody> {

  constructor(public telegram: TelegramService<FI000708ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    public _formateService: FormateService,
    private _logger: Logger) {
    super(telegram, errorHandler, 'FI000708');
  }
  send(data: FI000708ReqBody, reqHeader): Promise<any> {


    /**
     * 信託對帳單設定
     */


    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    };
    data.custId = userData.custId;
    this._logger.step('FUND', 'sendsendsend', data);
    return super.send(data, reqHeader).then(
      (resObj) => {


        this._logger.step('FUND', 'resObjresObj', resObj);
        let output = {
          status: false,
          trnsRsltCode: '',
          hostCode: '',
          hostCodeMsg: '',
          title: 'ERROR.TITLE',
          msg: 'ERROR.DEFAULT',
          classType: 'error',
          mailOut: '',
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

        this._logger.step('FUND', 'output', output);
        if (output.status) {
          output.mailOut = this._formateService.checkField(telegram, 'mailOut');
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



