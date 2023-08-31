import { Injectable } from '@angular/core';
import { FQ000307ReqBody } from './fq000307-req';
import { FQ000307ResBody } from './fq000307-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000307ApiService extends ApiBase<FQ000307ReqBody, FQ000307ResBody> {

  constructor(public telegram: TelegramService<FQ000307ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000307');
  }
}



