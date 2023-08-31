import { Injectable } from '@angular/core';
import { F1000103ReqBody } from './f1000103-req';
import { F1000103ResBody } from './f1000103-res';
import { ApiBase } from '@base/api/api-base.class';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F1000103ApiService extends ApiBase<F1000103ReqBody, F1000103ResBody> {

  constructor(public telegram: TelegramService<F1000103ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'F1000103');
  }

}
