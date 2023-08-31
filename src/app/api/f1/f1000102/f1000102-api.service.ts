import { Injectable } from '@angular/core';
import { F1000102ReqBody } from './f1000102-req';
import { F1000102Res } from './f1000102-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class F1000102ApiService extends ApiBase<F1000102ReqBody, F1000102Res> {

  constructor(public telegram: TelegramService<F1000102Res>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'F1000102');
  }

}
