import { Injectable } from '@angular/core';
import { FB000709ResBody } from './fb000709-res';
import { FB000709ReqBody } from './fb000709-req';

import { TelegramOption } from '@core/telegram/telegram-option';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000709ApiService extends ApiBase< FB000709ReqBody, FB000709ResBody> {
  constructor(public telegram: TelegramService< FB000709ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FB000709');
  }
  sendData(reqObj, security: any): Promise<any> {
    // 檢查安控
    let reqHeader = new TelegramOption();
    if (typeof security !== 'undefined' && security) {
      reqHeader.header = security;
    } else {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    return this.send(reqObj, reqHeader).then(
      (resObj) => {
        return Promise.resolve(resObj);
      },
      (errObj) => {
        return Promise.reject(errObj);
      }
    )
  }
}
