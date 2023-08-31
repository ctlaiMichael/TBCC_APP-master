import { Injectable } from '@angular/core';
import { FQ000403ReqBody } from './fq000403-req';
import { FQ000403ResBody } from './fq000403-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';

@Injectable()
export class FQ000403ApiService extends ApiBase<FQ000403ReqBody, FQ000403ResBody> {

    constructor(public telegram: TelegramService<FQ000403ResBody>,
        public errorHandler: HandleErrorService) {
        super(telegram, errorHandler, 'FQ000403');
    }

  send(data: FQ000403ReqBody): Promise<any> {
    /**
     * 參數處理
     */

    return super.send(data).then(
      (response) => {
        let output = EpayApiUtil.modifyInvoiceResponse(response);
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );

  }
}