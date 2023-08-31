import { Injectable } from '@angular/core';
import { FQ000404ReqBody } from './fq000404-req';
import { FQ000404ResBody } from './fq000404-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000404ApiService extends ApiBase<FQ000404ReqBody, FQ000404ResBody> {

  constructor(public telegram: TelegramService<FQ000404ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000404');
  }
}



