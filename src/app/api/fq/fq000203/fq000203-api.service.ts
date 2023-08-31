import { Injectable } from '@angular/core';
import { FQ000203ReqBody } from './fq000203-req';
import { FQ000203ResBody } from './fq000203-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000203ApiService extends ApiBase<FQ000203ReqBody, FQ000203ResBody> {

  constructor(public telegram: TelegramService<FQ000203ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000203');
  }

  TransArray(data) {
    data.body.details = this.modifyTransArray(data.body['details']['detail']);
    return data;
  }

}



