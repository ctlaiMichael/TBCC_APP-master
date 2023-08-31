import { Injectable } from '@angular/core';
import { FG000501ReqBody } from './fg000501-req';
import { FG000501Res } from './fg000501-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FG000501ApiService extends ApiBase<FG000501ReqBody, FG000501Res> {

  constructor(public telegram: TelegramService<FG000501Res>,
    public errorHandler: HandleErrorService
    , private authService: AuthService
  ) {
    super(telegram, errorHandler, 'FG000501');
  }

  send(data: FG000501ReqBody): Promise<any> {
    data.custId = this.authService.getCustId();
    return super.send(data);
  }

}
