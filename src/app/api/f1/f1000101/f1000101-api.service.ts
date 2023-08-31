import { Injectable } from '@angular/core';
import { F1000101ReqBody } from './f1000101-req';
import { F1000101ResBody } from './f1000101-res-body';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { TelegramOption } from '@core/telegram/telegram-option';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { F1000101Res } from './f1000101-response';

@Injectable()
export class F1000101ApiService extends ApiBase<F1000101ReqBody, F1000101Res> {

  constructor(
    public telegram: TelegramService<F1000101Res>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'F1000101');
  }

  send(data: F1000101ReqBody, option?: any): Promise<any> {
    return super.send(data, option);
  }

}
