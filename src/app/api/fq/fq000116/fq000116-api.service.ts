import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TelegramService } from '@core/telegram/telegram.service';
import { FQ000116ReqBody } from './fq000116-req';
import { FQ000116ResBody } from './fq000116-res';

@Injectable()
export class FQ000116ApiService extends ApiBase<FQ000116ReqBody, FQ000116ResBody> {

  constructor(
    public telegram: TelegramService<FQ000116ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService
  ) {
    super(telegram, errorHandler, 'FQ000116');
  }
  getReqBody() {
    // 參數處理
    let data: FQ000116ResBody = new FQ000116ResBody();
    // data.paginator = this.modifyPageReq(data.paginator, page, sort);
    const userData = this.authService.getUserInfo();
    // if (userData.hasOwnProperty('custId') && userData.custId != '') {
    //   data.custId = userData.custId; // user info;
    // }
    return data;
  }

}



