import { Injectable } from '@angular/core';
import { BI000104ReqBody } from './bi000104-req';
import { BI000104ResBody } from './bi000104-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class BI000104ApiService extends ApiBase<BI000104ReqBody, BI000104ResBody> {

  constructor(public telegram: TelegramService<BI000104ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'BI000104');
  }

  send(data: BI000104ReqBody, option?: any): Promise<any> {
    data.bodyDeviceId = ''; // 先強制關閉，避免UDID轉換問題
    return super.send(data, option);
  }

}
