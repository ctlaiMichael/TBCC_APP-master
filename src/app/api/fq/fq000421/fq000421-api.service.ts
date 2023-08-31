import { Injectable } from '@angular/core';
import { FQ000421ReqBody } from './fq000421-req';
import { FQ000421ResBody } from './fq000421-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000421ApiService extends ApiBase<FQ000421ReqBody, FQ000421ResBody> {

  constructor(public telegram: TelegramService<FQ000421ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000421');
  }
}



