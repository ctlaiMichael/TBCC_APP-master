/**
 * 主掃解析
 * QR Code驗證
 * 交易類型 trnsType
 *    01-購物交易
 *    02-轉帳交易
 *    03-繳費交易
 */
import { Injectable } from '@angular/core';
import { FQ000104ReqBody } from './fq000104-req';
import { FQ000104ResBody } from './fq000104-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FQ000104ApiService extends ApiBase<FQ000104ReqBody, FQ000104ResBody> {

  constructor(
    public telegram: TelegramService<FQ000104ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FQ000104');
  }


  send(data: FQ000104ResBody): Promise<any> {
    /**
     * 參數處理
     */
    let set_data = new FQ000104ResBody();
    set_data.custId = this.authService.getCustId();
    if (!data.hasOwnProperty('QRCode') || !data.QRCode || data.QRCode == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    set_data.QRCode = data.QRCode;
    set_data.prefixURL = data.prefixURL;

    return super.send(set_data).then(
      (resObj) => {
        let checkRes: any = EpayApiUtil.modifyResponse(resObj);
        if (!checkRes.status) {
          return Promise.reject(checkRes);
        }

        // 收單行資訊
        let acqInfo = this._formateService.checkField(checkRes.body, 'acqInfo');
        if (!acqInfo) {
          checkRes.body['acqInfo'] = ''; // 跟QRCode不同，但回傳string讓後面程序正常
        }
        // 交易型態
        const trnsType = this._formateService.checkField(checkRes.body, 'trnsType');

        // 後面針對null的處理都沒有處理好，以下強制給空值
        let check_list = [
          'merchantName' // 特店名稱
          , 'countryCode' // 國別碼
          , 'version' // 版本
          , 'txnAmt' // 交易金額
          , 'txnCurrencyCode' // 交易幣別
        ];
        if (trnsType == '01') {
          // 購物交易 才有欄位判斷
          check_list.concat([
            'orderNbr' // 訂單編號
            , 'secureCode' // 安全碼
            , 'qrExpirydate' // QR Code 效期
          ]);
        } else if (trnsType == '02') {
          // 轉帳交易 才有欄位判斷
          check_list.concat([
            'transfereeBank' // 轉入行代碼
            , 'transfereeAccount' // 轉入帳號
            , 'note' // 備註
          ]);
        } else if (trnsType == '03') {
          // 繳費 才有欄位判斷
          check_list.concat([
            'canAmtEdit' // 交易金額可否修改
            , 'secureCode' // 安全碼
            , 'deadlinefinal' // 繳納期限(截止日)
            , 'noticeNbr' // 銷帳編號
            , 'otherInfo' // 其他資訊
            , 'qrExpirydate' // QR Code 效期
            , 'feeInfo' // 費用資訊
            , 'charge' // 使用者支付手續費
            , 'feeName' // 費用名稱
          ]);
        }

        check_list.forEach((field) => {
          let tmp_field = this._formateService.checkField(checkRes.body, field);
          if (!tmp_field) {
            checkRes.body[field] = '';
          }
        });

        return Promise.resolve(checkRes);

      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }


}



