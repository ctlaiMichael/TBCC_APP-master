import { Injectable } from '@angular/core';
import { FQ000405ReqBody } from './fq000405-req';
import { FQ000405ResBody } from './fq000405-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000405ApiService extends ApiBase<FQ000405ReqBody, FQ000405ResBody> {

  constructor(public telegram: TelegramService<FQ000405ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000405');
  }
}



