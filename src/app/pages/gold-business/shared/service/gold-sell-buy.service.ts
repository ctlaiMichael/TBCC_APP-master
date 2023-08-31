import { Injectable } from '@angular/core';
import { FB000708ApiService } from '@api/fb/fb000708/fb000708-api.service';
import { FB000708ReqBody } from '@api/fb/fb000708/fb000708-req';
import { AuthService } from '@core/auth/auth.service';
import { FB000709ApiService } from '@api/fb/fb000709/fb000709-api.service';
import { FB000709ReqBody } from '@api/fb/fb000709/fb000709-req';
import { FB000705ApiService } from '@api/fb/fb000705/fb000705-api.service';
import { FB000705ReqBody } from '@api/fb/fb000705/fb000705-req';

@Injectable()
export class GoldSellBuyService {

  constructor(
    private authService: AuthService,
    private fb000708: FB000708ApiService,
    private fb000709: FB000709ApiService,
    private fb000705: FB000705ApiService,
  ) { }

  getGoldAcctList(reqObj): Promise<any> {
    const form = new FB000705ReqBody();
    form.queryType = reqObj.queryType;
    return this.fb000705.getData(form).then(
      (resObj) => {
        return Promise.resolve(resObj.body);
      },
      (errObj) => {
        return Promise.reject(errObj);
      }
    );
  }

  getTransConfirm(reqObj): Promise<any> {
    const form: FB000708ReqBody = {
      custId : this.authService.getCustId(),
      recType : reqObj.recType,
      goldAccount : reqObj.goldAccount,
      trnsfrAccount: reqObj.trnsfrAccount,
      goldQuantity: reqObj.goldQuantity,
    };
    return this.fb000708.send(form).then(
      (resObj) => {
        return Promise.resolve(resObj.body);
      },
      (errObj) => {
        return Promise.reject(errObj);
      }
    )
  }
  /**
   * 
   * @param reqObj
   * @param security {SecurityType:1-SSL,2-憑證, SecurityPassword: }
   */
  goldTransSend(reqObj, security): Promise<any> {
    if (typeof security.SecurityType == 'undefined') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }

    const form: FB000709ReqBody = {
      custId : this.authService.getCustId(),
      recType : reqObj.recType,
      goldAccount : reqObj.goldAccount,
      trnsfrAccount: reqObj.trnsfrAccount,
      goldQuantity: reqObj.goldQuantity,
      goldRateTime: reqObj.goldRateTime,
      gold1GAmt: reqObj.gold1GAmt,
      transAmt: reqObj.transAmt,
      discountAmt: reqObj.discountAmt,
      trnsToken: reqObj.trnsToken
    };
    return this.fb000709.sendData(form, security).then(
      (resObj) => {
        return Promise.resolve(resObj.body);
      },
      (errObj) => {
        return Promise.reject(errObj);
      }
    )
  }
}
