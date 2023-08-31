import { Injectable } from '@angular/core';
import { FQ000201ReqBody } from './fq000201-req';
import { FQ000201ResBody } from './fq000201-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FQ000201ApiService extends ApiBase<FQ000201ReqBody, FQ000201ResBody> {

  constructor(
    public telegram: TelegramService<FQ000201ResBody>,
    public errorHandler: HandleErrorService
    , private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'FQ000201');
  }

  send(data: FQ000201ReqBody, option?: any): Promise<any> {

    return super.send(data, option).then(
      (resObj) => {
        let output = EpayApiUtil.modifyResponse(resObj);
        output.body.trnsDateTime = this._formateService.checkField(output.body, 'trnsDateTime');
        output.body.payCategory = this._formateService.checkField(output.body, 'payCategory');
        output.body.trnsAmoun = this._formateService.checkField(output.body, 'trnsAmoun');
        output.body.authCode = this._formateService.checkField(output.body, 'authCode');
        output.body.payNo = this._formateService.checkField(output.body, 'payNo');
        output.body.txnStan = this._formateService.checkField(output.body, 'txnStan');
        output.body.trnsNo = this._formateService.checkField(output.body, 'trnsNo');
        output.body.trnsfrOutAcct = this._formateService.checkField(output.body, 'trnsfrOutAcct');
        output.body.cardNo = this._formateService.checkField(output.body, 'cardNo');

        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}



