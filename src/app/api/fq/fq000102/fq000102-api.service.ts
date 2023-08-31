/**
 * FQ000102-EMV QR Code解析
 * transType
 *  1:僅信用卡
 *  2.整合型
 *  3.僅TaiwanPay
 */
import { Injectable } from '@angular/core';
import { FQ000102ReqBody } from './fq000102-req';
import { FQ000102ResBody } from './fq000102-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FQ000102ApiService extends ApiBase<FQ000102ReqBody, FQ000102ResBody> {

  constructor(
    public telegram: TelegramService<FQ000102ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FQ000102');
  }


  send(data: FQ000102ReqBody): Promise<any> {
    /**
     * 參數處理
     */
    let set_data = new FQ000102ReqBody();
    set_data.custId = this.authService.getCustId();
    if (!data.hasOwnProperty('EMVQRCode') || !data.EMVQRCode || data.EMVQRCode == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    set_data.EMVQRCode = data.EMVQRCode;

    return super.send(set_data).then(
      (resObj) => {
        let checkRes = EpayApiUtil.modifyResponse(resObj);
        if (!checkRes.status) {
          return Promise.reject(checkRes);
        }
        let output: any = checkRes.body;
        output['_qrType'] = this._formateService.checkField(output, 'transType');
        output['_support'] = {
          'T': false,
          'V': false,
          'M': false,
          'J': false
        };
        output['onlyCard'] = false;
        output['need104Flag'] = false;
        output['boundleRes'] = false;
        // 判斷支援的卡片公司
        const supportScheme = this._formateService.checkField(output, 'supportScheme');
        let supportSchemeList = supportScheme.split(',');
        let tk: any;
        supportSchemeList.forEach(suppor => {
          let chk = suppor.toLocaleUpperCase();
          if (output['_support'].hasOwnProperty(chk)) {
            output['_support'][chk] = true;
          }
        });

        let allow_type = ['1', '2', '3'];
        if (allow_type.indexOf(output['_qrType']) <= -1) {
          return Promise.reject({
            title: 'ERROR.TITLE',
            msg: 'EPAY.ERROR.UNKNOW_EVM_QRTYPE' // 非emv非台灣pay
          });
        }

        let have_VMJ = (output['_support']['V'] || output['_support']['M'] || output['_support']['J'])
                        ? true : false;

        if (output['_qrType'] == '1') {
          // 有emv無taiwanPay
          if (!have_VMJ) {
            return Promise.reject({
              title: 'ERROR.TITLE',
              msg: 'EPAY.ERROR.UNKNOW_EVM_SUPPORT' // QR Code掃描失敗(SUPPORT_ERRPR)
            });
          }
          const countryCode = this._formateService.checkField(output, 'countryCode');
          const transactionCurrency = this._formateService.checkField(output, 'transactionCurrency');
          if (countryCode != 'TW' || transactionCurrency != '901') {
            return Promise.reject({
              title: 'ERROR.TITLE',
              msg: 'EPAY.ERROR.OFFSHORE_NOSUPPORT' // 目前不支援境外交易
            });
          }
          this._logger.log('go to qrCodePayCardForm');
          output['need104Flag'] = false;
          output['onlyCard'] = true;
          return Promise.resolve(output);
        } else if (output['_qrType'] == '2') {
          // 有emv有taiwanPay
          output['need104Flag'] = true;
          if (have_VMJ) {
            output['boundleRes'] = true;
          }
          return Promise.resolve(output);
        } else if (output['_qrType'] == '3') {
          // 台灣pay
          output['need104Flag'] = true;
          output['boundleRes'] = true;
          return Promise.resolve(output);
        }
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}



