import { Injectable } from '@angular/core';
import { FQ000113ReqBody } from './fq000113-req';
import { FQ000113ResBody } from './fq000113-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FQ000113ApiService extends ApiBase<FQ000113ReqBody, FQ000113ResBody> {

  constructor(public telegram: TelegramService<FQ000113ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FQ000113');
  }

  send(data: FQ000113ReqBody,reqHeader?): Promise<any> {
    return super.send(data,reqHeader).then(
      (response) => {
        return Promise.resolve(response);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );

  }

}



