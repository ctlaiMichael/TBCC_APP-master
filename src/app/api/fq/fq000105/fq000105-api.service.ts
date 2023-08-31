import { Injectable } from '@angular/core';
import { FQ000105ReqBody } from './fq000105-req';
import { FQ000105ResBody } from './fq000105-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';

@Injectable()
export class FQ000105ApiService extends ApiBase<FQ000105ReqBody, FQ000105ResBody> {

  constructor(public telegram: TelegramService<FQ000105ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000105');
  }

  TransArray(data) {
    data.body.details = this.modifyTransArray(data.body['details']['detail']);
    return data;
  }

}



