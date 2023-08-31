import { Injectable } from '@angular/core';
import { BI000103ReqBody } from './bi000103-req';
import { BI000103ResBody } from './bi000103-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class BI000103ApiService extends ApiBase<BI000103ReqBody, BI000103ResBody> {

  constructor(public telegram: TelegramService<BI000103ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'BI000103');
  }

  send(data: BI000103ReqBody, option?: any): Promise<any> {
    data.deviceId = ''; // 先強制關閉，避免UDID轉換問題
    data.userId = data.userId.toUpperCase();
    return super.send(data, option);
  }
}
