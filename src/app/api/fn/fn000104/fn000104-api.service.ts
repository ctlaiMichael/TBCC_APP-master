import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FN000104ReqBody } from './fn000104-req';
import { FN000104ResBody } from './fn000104-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FN000104ApiService extends ApiBase<FN000104ReqBody, FN000104ResBody> {

  constructor(
    private _formateService: FormateService,
    public _authService: AuthService,
    public telegram: TelegramService<FN000104ResBody>,
    public errorHandler: HandleErrorService) {
    super(telegram, errorHandler, 'FN000104');
  }
  send(data: FN000104ReqBody): Promise<any> {
    return super.send(data);
  }

  /**
   * 無卡提款-取消預約
   * @param {any} trnsData    預約紀錄資料
   * @param {string} trnsToken 交易控制碼
   * @returns {Promise<any>}
   * @memberof FN000104ApiService
   */
  cancelTrns(trnsData: any, trnsToken: string): Promise<any> {
    let userData = this._authService.getUserInfo();

    // FN000104 上行欄位
    let data: FN000104ReqBody = new FN000104ReqBody();
    data.custId = userData.custId;        // 身分證字號
    data.trnsAccnt = trnsData.applyAccno; // 提款帳號
    data.recType = 'D';                   // 交易類別(固定為 D-取消預約)
    data.trnsTxNo = trnsData.transTxno;   // 預約無卡提款序號
    if (!!trnsData.applyDateTime) {
      data.nocrwdDay = trnsData.applyDateTime.substring(0, 8);  // 無卡提款預約交易日期YYYYMMDD
    }
    data.transAmt = String(parseInt(trnsData.applyAmt, 10));    // 提款金額
    data.trnsToken = trnsToken;

    return this.send(data).then(
      (S) => {
        return Promise.resolve(this._modifyRespose(S));
      },
      (F) => {
        return Promise.reject(F);
      }
    );
  }

  private _modifyRespose(resObj) {
    let result: any;
    let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
    let jsonBody = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
    if (jsonBody.hasOwnProperty('hostCode') && jsonBody.hostCode != '4001') {
      result = jsonBody;
    } else {
      result = this._formateService.checkField(jsonHeader, 'responseTime');
    }

    return result;
  }
}
