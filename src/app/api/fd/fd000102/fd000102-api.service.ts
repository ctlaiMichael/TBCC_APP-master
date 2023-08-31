import { Injectable } from '@angular/core';
import { FD000102ReqBody } from './fd000102.req';
import { FD000102Res } from './fd000102.res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FD000102ApiService extends ApiBase<FD000102ReqBody, FD000102Res> {

  constructor(public telegram: TelegramService<FD000102Res>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FD000102');
  }

}
