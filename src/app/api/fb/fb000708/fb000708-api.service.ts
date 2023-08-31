import { Injectable } from '@angular/core';
import { FB000708ResBody } from './fb000708-res';
import { FB000708ReqBody } from './fb000708-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000708ApiService extends ApiBase< FB000708ReqBody, FB000708ResBody> {
  constructor(public telegram: TelegramService< FB000708ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FB000708');
  }

}
