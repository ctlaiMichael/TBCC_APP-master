import { Injectable } from '@angular/core';
import { FQ000202ReqBody } from './fq000202-req';
import { FQ000202ResBody } from './fq000202-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000202ApiService extends ApiBase<FQ000202ReqBody, FQ000202ResBody> {

  constructor(public telegram: TelegramService<FQ000202ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000202');
  }

  TransArray(data) {
    data.body.details = this.modifyTransArray(data.body['details']['detail']);
    return data;
  }

}



