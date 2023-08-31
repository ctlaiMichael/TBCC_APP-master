import { Injectable } from '@angular/core';
import { FB000601ReqBody } from './fb000601-req';
import { FB000601ResBody } from './fb000601-res';
import { ApiBase } from '@base/api/api-base.class';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';


@Injectable()
export class Fb000601ApiService extends ApiBase<FB000601ReqBody, FB000601ResBody> {
  
  constructor(
    public telegram: TelegramService<FB000601ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FB000601');
  }
  
}
