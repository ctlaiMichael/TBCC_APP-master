import { Injectable } from '@angular/core';
import { FQ000302ReqBody } from './fq000302-req';
import { FQ000302ResBody } from './fq000302-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000302ApiService extends ApiBase<FQ000302ReqBody, FQ000302ResBody> {

  constructor(public telegram: TelegramService<FQ000302ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000302');
  }
}



