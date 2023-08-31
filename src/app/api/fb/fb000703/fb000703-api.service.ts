import { Injectable } from '@angular/core';
import { FB000703ResBody } from './fb000703-res';
import { FB000703ReqBody } from './fb000703-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000703ApiService extends ApiBase< FB000703ReqBody, FB000703ResBody> {
  constructor(public telegram: TelegramService< FB000703ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FB000703');
  }

}
