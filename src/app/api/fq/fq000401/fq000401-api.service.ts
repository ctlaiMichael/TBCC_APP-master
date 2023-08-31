import { Injectable } from '@angular/core';
import { FQ000401ReqBody } from './fq000401-req';
import { FQ000401ResBody } from './fq000401-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000401ApiService extends ApiBase<FQ000401ReqBody, FQ000401ResBody> {

  constructor(public telegram: TelegramService<FQ000401ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000401');
  }
}



