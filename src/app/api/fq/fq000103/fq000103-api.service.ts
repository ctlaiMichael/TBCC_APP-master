import { Injectable } from '@angular/core';
import { FQ000103ReqBody } from './fq000103-req';
import { FQ000103ResBody } from './fq000103-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000103ApiService extends ApiBase<FQ000103ReqBody, FQ000103ResBody> {

  constructor(public telegram: TelegramService<FQ000103ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000103');
  }
}



