import { Injectable } from '@angular/core';
import { FQ000305ReqBody } from './fq000305-req';
import { FQ000305ResBody } from './fq000305-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000305ApiService extends ApiBase<FQ000305ReqBody, FQ000305ResBody> {

  constructor(public telegram: TelegramService<FQ000305ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000305');
  }
}



