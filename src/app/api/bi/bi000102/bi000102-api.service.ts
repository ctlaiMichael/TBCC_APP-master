import { Injectable } from '@angular/core';
import { BI000102ReqBody } from './bi000102-req';
import { BI000102ResBody } from './bi000102-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class BI000102ApiService extends ApiBase<BI000102ReqBody, BI000102ResBody> {

  constructor(public telegram: TelegramService<BI000102ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'BI000102');
  }

  send(data: BI000102ReqBody, option?: any): Promise<any> {
    return super.send(data, option);
  }
}
