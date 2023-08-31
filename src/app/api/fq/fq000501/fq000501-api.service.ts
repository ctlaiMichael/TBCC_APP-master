import { Injectable } from '@angular/core';
import { FQ000501ReqBody } from './fq000501-req';
import { FQ000501ResBody } from './fq000501-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FQ000501ApiService extends ApiBase<FQ000501ReqBody, FQ000501ResBody> {

  constructor(public telegram: TelegramService<FQ000501ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
  ) {
    super(telegram, errorHandler, 'FQ000501');
  }
  returnData;
  returnelectricinfoData;
  /**
  * @param obj 網址
  */
  getData(obj): Promise<any> {
    const form = new FQ000501ReqBody();
    form.custId = this.authService.getCustId();
    form.custInfo = obj;
    return this.send(form).then(
      (resObj) => {

        if (resObj.body['details'] != null) {
          this.returnelectricinfoData = [resObj.body['electricNo'], resObj.body['typeAndFee'], resObj.body['feeSessionId']];
          this.returnData = this.modifyTransArray(resObj.body['details']['detail']);
        } else {
          this.returnData = null;
        }
        return Promise.resolve([this.returnelectricinfoData, this.returnData, resObj.body.rtnCode, resObj.body.canPayment, resObj.body.trnsToken, resObj.body.typeAndFee,
        ]);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );




  }
}



