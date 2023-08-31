import { Injectable } from '@angular/core';
import { BI000100ReqBody } from './bi000100-req';
import { BI000100ResBody } from './bi000100-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class BI000100ApiService extends ApiBase<BI000100ReqBody, BI000100ResBody> {

  constructor(public telegram: TelegramService<BI000100ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'BI000100');
  }

}
