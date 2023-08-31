import { Injectable } from '@angular/core';
import { FQ000406ReqBody } from './fq000406-req';
import { FQ000406ResBody } from './fq000406-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000406ApiService extends ApiBase<FQ000406ReqBody, FQ000406ResBody> {

  constructor(public telegram: TelegramService<FQ000406ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000406');
  }
}



