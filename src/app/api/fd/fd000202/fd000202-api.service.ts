import { Injectable } from '@angular/core';
import { FD000202ReqBody } from './fd000202.req';
import { FD000202Res } from './fd000202.res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FD000202ApiService extends ApiBase<FD000202ReqBody, FD000202Res> {

  constructor(public telegram: TelegramService<FD000202Res>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FD000202');
  }

}
