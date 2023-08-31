import { Injectable } from '@angular/core';
import { FQ000111ReqBody } from './fq000111-req';
import { FQ000111ResBody } from './fq000111-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000111ApiService extends ApiBase<FQ000111ReqBody, FQ000111ResBody> {

  constructor(public telegram: TelegramService<FQ000111ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000111');
  }
}



