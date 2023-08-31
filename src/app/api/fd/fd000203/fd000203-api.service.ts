import { Injectable } from '@angular/core';
import { FD000203ReqBody } from './fd000203.req';
import { FD000203Res } from './fd000203.res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FD000203ApiService extends ApiBase<FD000203ReqBody, FD000203Res> {

  constructor(public telegram: TelegramService<FD000203Res>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FD000203');
  }

}
