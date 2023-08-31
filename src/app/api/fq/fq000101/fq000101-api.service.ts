/**
 * QR Code轉出帳號查詢
 * txnType
 *    S:設定
 *    T:交易
 *    E:電子發票設定
 *    A:查詢有金融卡的約定轉出帳號
 */
import { Injectable } from '@angular/core';
import { FQ000101ReqBody } from './fq000101-req';
import { FQ000101ResBody } from './fq000101-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FQ000101ApiService extends ApiBase<FQ000101ReqBody, FQ000101ResBody> {

  constructor(
    public telegram: TelegramService<FQ000101ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
		private _logger: Logger,
  ) {
    super(telegram, errorHandler, 'FQ000101');
  }

  /**
   * QR Code轉出帳號查詢 - 交易
   */
  getTrans(): Promise<any> {
    const form = new FQ000101ReqBody();
    form.custId = this.authService.getCustId();
    form.txnType = 'T';
    return this.send(form).then(
      (resObj) => {

        // this._logger.step('Epay', '101 resObj ',resObj);
        let modifyData = this._modifyResponse(resObj);
        // // 無資料不顯示
        // if (!modifyData.checkRes.status) {
        //   return Promise.reject(checkRes);
        // }

        // this._logger.step('Epay', '101 modifyData ',modifyData);
        let output: any = this._formateService.transClone(modifyData.data);

        // this._logger.step('Epay', '101 output ',output,modifyData.data);
        output['_accountData'] = {
          default: output.defaultTrnsOutAcct,
          mask: '',
          data: output.trnsOutAccts.transAccount
        };

        // 帳號模糊化 ex:"0560-***-***456"
        let trnsOutAcct = output.defaultTrnsOutAcct;
        let trnsAcctReFmt = trnsOutAcct;
        if (trnsOutAcct.length > 13) {
          trnsAcctReFmt = trnsOutAcct.substr(-13, 13);
        }
        output._accountData.mask = this._formateService.transAccount(trnsAcctReFmt, 'mask');


        this._logger.step('Epay', '101 resObj output',output);
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }


  /**
   * QR Code轉出帳號查詢 - 電子發票設定
   */
  getElect(): Promise<any> {
    const form = new FQ000101ReqBody();
    form.custId = this.authService.getCustId();
    form.txnType = 'E';
    return this.send(form).then(
      (resObj) => {
        let output: any;

        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }


  private _modifyResponse(resObj) {
    let checkRes = EpayApiUtil.modifyResponse(resObj);
    let jsonObj = checkRes.body;
    let output = {
      status: checkRes.status,
      msg: checkRes.msg,
      defaultTrnsOutAcct: '', // 預設轉出帳號
      isAgreeQRCode: '', // 是否同意QRCode註記: Y-同意,N-不同意,空白-未表示
      trnsLimitAmt: '', // 單筆限額(含小數2位)
      mobileBarcode: '', // 雲端發票條碼
      loveCode: '', // 愛心碼
      socialWelfareName: '', // 愛心碼名稱
      defaultBarcode: '', // 發票預設值: 發票預設值 =1  為雲端發票條碼, 發票預設值 =2  為捐贈愛心碼
      defaultTrnsCard: '', // 轉出信用卡
      cardType: '', // 因原www程式有此欄位，但現行中台沒有，位維持正常先置放(可能是廢欄位)
      trnsOutAccts: { trnsOutAcct : [] }
    };
    output.isAgreeQRCode = this._formateService.checkField(jsonObj, 'isAgreeQRCode');
    if (output.isAgreeQRCode !== '') {
      output.isAgreeQRCode = output.isAgreeQRCode.toLocaleUpperCase();
    }
    output.trnsLimitAmt = this._formateService.checkField(jsonObj, 'trnsLimitAmt');

    // 轉出帳號
    output.defaultTrnsOutAcct = this._formateService.checkField(jsonObj, 'defaultTrnsOutAcct');

    // 轉出信用卡
    output.defaultTrnsCard = this._formateService.checkField(jsonObj, 'defaultTrnsCard');
    output.cardType = this._formateService.checkField(jsonObj, 'cardType');

    // 雲端發票條碼
    output.mobileBarcode = this._formateService.checkField(jsonObj, 'mobileBarcode');
    output.loveCode = this._formateService.checkField(jsonObj, 'loveCode');
    output.socialWelfareName = this._formateService.checkField(jsonObj, 'socialWelfareName');
    output.defaultBarcode = this._formateService.checkField(jsonObj, 'defaultBarcode');

    // 轉出帳號列表

    let check_obj = this.checkObjectList(jsonObj, 'trnsOutAccts.trnsOutAcct');
    let detail_data = [];
    if (typeof check_obj !== 'undefined') {
        detail_data = this.modifyTransArray(check_obj);
    }
    output.trnsOutAccts.trnsOutAcct = detail_data;

    return {
      checkRes: checkRes,
      data: output
    };
  }

}



