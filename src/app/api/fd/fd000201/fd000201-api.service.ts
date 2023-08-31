import { Injectable } from '@angular/core';
import { FD000201ReqBody } from './fd000201.req';
import { FD000201Res } from './fd000201.res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FD000201ApiService extends ApiBase<FD000201ReqBody, FD000201Res> {

  constructor(public telegram: TelegramService<FD000201Res>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FD000201');
  }

}
