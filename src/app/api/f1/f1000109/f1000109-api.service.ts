import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { F1000109ReqBody } from './f1000109-req-body';
import { F1000109Response } from './f1000109-response';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramOption } from '@core/telegram/telegram-option';

@Injectable()
export class F1000109ApiService extends ApiBase < F1000109ReqBody, F1000109Response > {

  constructor(public telegram: TelegramService<F1000109Response>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'F1000109');
  }

  send(data: F1000109ReqBody, option?: TelegramOption): Promise<any> {
    return super.send(data, option);
  }
}
