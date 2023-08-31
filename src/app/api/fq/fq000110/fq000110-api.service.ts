import { Injectable } from '@angular/core';
import { FQ000110ReqBody } from './fq000110-req';
import { FQ000110ResBody } from './fq000110-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000110ApiService extends ApiBase<FQ000110ReqBody, FQ000110ResBody> {

  constructor(public telegram: TelegramService<FQ000110ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000110');
  }
}



