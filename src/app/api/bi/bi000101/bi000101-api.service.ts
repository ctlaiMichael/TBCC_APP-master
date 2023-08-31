import { Injectable } from '@angular/core';
import { BI000101ReqBody } from './bi000101-req';
import { BI000101ResBody } from './bi000101-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class BI000101ApiService extends ApiBase<BI000101ReqBody, BI000101ResBody> {

  constructor(public telegram: TelegramService<BI000101ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'BI000101');
  }

}
