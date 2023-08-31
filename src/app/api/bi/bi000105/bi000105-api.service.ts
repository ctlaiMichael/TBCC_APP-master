import { Injectable } from '@angular/core';
import { BI000105ReqBody } from './bi000105-req';
import { BI000105ResBody } from './bi000105-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class BI000105ApiService extends ApiBase<BI000105ReqBody, BI000105ResBody> {

  constructor(public telegram: TelegramService<BI000105ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'BI000105');
  }

  send(data: BI000105ReqBody, option?: any): Promise<any> {
    return super.send(data, option);
  }
}
