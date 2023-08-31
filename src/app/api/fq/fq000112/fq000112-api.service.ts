import { Injectable } from '@angular/core';
import { FQ000112ReqBody } from './fq000112-req';
import { FQ000112ResBody } from './fq000112-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000112ApiService extends ApiBase<FQ000112ReqBody, FQ000112ResBody> {

  constructor(public telegram: TelegramService<FQ000112ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000112');
  }
}



