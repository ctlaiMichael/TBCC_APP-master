import { Injectable } from '@angular/core';
import { FD000301ReqBody } from './fd000301.req';
import { FD000301Res } from './fd000301.res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FD000301ApiService extends ApiBase<FD000301ReqBody, FD000301Res> {

  constructor(public telegram: TelegramService<FD000301Res>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FD000301');
  }

}
