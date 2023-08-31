import { Injectable } from '@angular/core';
import { FD000101ReqBody } from './fd000101.req';
import { FD000101Res } from './fd000101.res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
@Injectable()
export class FD000101ApiService extends ApiBase<FD000101ReqBody, FD000101Res> {

  constructor(public telegram: TelegramService<FD000101Res>,
    public authService: AuthService,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FD000101');
  }

  getData(): Promise<any> {
    const custId = this.authService.getUserInfo().custId;
    const data = new FD000101ReqBody();
    data.custId = custId; // user info;

    return this.send(data).then(
      (resObj) => {
        let returnData;
        if (resObj.body['details'] == null){
           returnData = [];
        } else {
          returnData = this.modifyTransArray(resObj.body['details']['detail']);
        }
        return Promise.resolve(returnData);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}
