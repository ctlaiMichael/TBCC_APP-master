import { Injectable } from '@angular/core';
import { FB000711ResBody } from './fb000711-res';
import { FB000711ReqBody } from './fb000711-req';

import { TelegramOption } from '@core/telegram/telegram-option';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000711ApiService extends ApiBase< FB000711ReqBody, FB000711ResBody> {
  constructor(public telegram: TelegramService< FB000711ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FB000711');
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
    );
  }
}
