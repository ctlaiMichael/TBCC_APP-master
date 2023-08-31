import { Injectable } from '@angular/core';
import { FQ000303ReqBody } from './fq000303-req';
import { FQ000303ResBody } from './fq000303-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000303ApiService extends ApiBase<FQ000303ReqBody, FQ000303ResBody> {

  constructor(public telegram: TelegramService<FQ000303ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000303');
  }

  TransArray(data) {
    data.body.details = this.modifyTransArray(data.body['details']['detail']);
    return data;
  }

}



