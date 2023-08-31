import { Injectable } from '@angular/core';
import { FQ000306ReqBody } from './fq000306-req';
import { FQ000306ResBody } from './fq000306-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000306ApiService extends ApiBase<FQ000306ReqBody, FQ000306ResBody> {

  constructor(public telegram: TelegramService<FQ000306ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000306');
  }
}



