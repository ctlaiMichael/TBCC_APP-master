import { Injectable } from '@angular/core';
import { FB000302ResBody } from './fb000302-res';
import { FB000302ReqBody } from './fb000302-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000302ApiService extends ApiBase< FB000302ReqBody, FB000302ResBody> {
  constructor(public telegram: TelegramService< FB000302ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FB000302');
  }

}
