import { Injectable } from '@angular/core';
import { FQ000502ReqBody } from './fq000502-req';
import { FQ000502ResBody } from './fq000502-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FQ000502ApiService extends ApiBase<FQ000502ReqBody, FQ000502ResBody> {

  constructor(public telegram: TelegramService<FQ000502ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
  ) {
    super(telegram, errorHandler, 'FQ000502');
  }
}



