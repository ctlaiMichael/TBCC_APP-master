import { Injectable } from '@angular/core';
import { FC000303ReqBody } from './fc000303-req';
import { FC000303ResBody } from './fc000303-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { TelegramOption } from '@core/telegram/telegram-option';
import { HandleErrorService } from '@core/handle-error/handle-error.service';


@Injectable()
export class FC000303ApiService extends ApiBase<FC000303ReqBody, FC000303ResBody> {

  constructor(
    public telegram: TelegramService<FC000303ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FC000303');
  }

  send(data: FC000303ReqBody, option?: any): Promise<any> {
    return super.send(data, option);
  }

}
