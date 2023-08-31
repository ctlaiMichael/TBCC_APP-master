import { Injectable } from '@angular/core';
import { FB000710ResBody } from './fb000710-res';
import { FB000710ReqBody } from './fb000710-req';

import { TelegramOption } from '@core/telegram/telegram-option';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000710ApiService extends ApiBase< FB000710ReqBody, FB000710ResBody> {
  constructor(public telegram: TelegramService< FB000710ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FB000710');
  }
}
