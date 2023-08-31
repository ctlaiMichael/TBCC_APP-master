import { Injectable } from '@angular/core';
import { FQ000420ReqBody } from './fq000420-req';
import { FQ000420ResBody } from './fq000420-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';

@Injectable()
export class FQ000420ApiService extends ApiBase<FQ000420ReqBody, FQ000420ResBody> {

  constructor(public telegram: TelegramService<FQ000420ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000420');
  }


  send(data: FQ000420ReqBody): Promise<any> {
    return super.send(data).then(
      (resObj) => {
        let checkRes = EpayApiUtil.modifyResponse(resObj);
        let output = {
          checkRes: checkRes,
          data: checkRes.body
        };

        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }


}



