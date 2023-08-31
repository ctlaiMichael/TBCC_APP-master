import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramService } from '@core/telegram/telegram.service';
import { FQ000115ReqBody } from './fq000115-req';
import { FQ000115ResBody } from './fq000115-res';

@Injectable()
export class FQ000115ApiService extends ApiBase<FQ000115ReqBody, FQ000115ResBody> {

  constructor(
    public telegram: TelegramService<FQ000115ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService
  ) {
    super(telegram, errorHandler, 'FQ000115');
  }
  getReqBody() {
    // 參數處理
    let data: FQ000115ReqBody = new FQ000115ReqBody();
    // data.paginator = this.modifyPageReq(data.paginator, page, sort);
    const userData = this.authService.getUserInfo();
    // if (userData.hasOwnProperty('custId') && userData.custId != '') {
    //   data.custId = userData.custId; // user info;
    // }
    return data;
  }

}



