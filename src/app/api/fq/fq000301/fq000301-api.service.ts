import { Injectable } from '@angular/core';
import { FQ000301ReqBody } from './fq000301-req';
import { FQ000301ResBody } from './fq000301-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000301ApiService extends ApiBase<FQ000301ReqBody, FQ000301ResBody> {

  constructor(public telegram: TelegramService<FQ000301ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000301');
  }
}



