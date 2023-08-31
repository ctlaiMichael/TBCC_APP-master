/**
 * F1000105-OTP密碼請求
 * custId	身分證字號
 * fnctId	電文ID => 新業務請跟資訊部申請簡訊文案
 * depositNumber	轉入帳號
 * depositMoney	金額 => 不可為空，不可formate
 * OutCurr 	交易幣別
 * transTypeDesc	基金交易項目說明
 */
import { Injectable } from '@angular/core';
import { F1000105ReqBody } from './f1000105-req';
import { F1000105ResBody } from './f1000105-res';
import { ApiBase } from '@base/api/api-base.class';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F1000105ApiService extends ApiBase<F1000105ReqBody, F1000105ResBody> {

  constructor(public telegram: TelegramService<F1000105ResBody>,
    public errorHandler: HandleErrorService,
    private _logger: Logger
    ) {
    super(telegram, errorHandler, 'F1000105');
  }
  send(req: F1000105ReqBody) {
    // 參數處理
    let form = new F1000105ReqBody();
    this._logger.log('sendform', form);
    form.custId = req.custId;
    form.fnctId = req.fnctId.toLocaleUpperCase();
    form.depositNumber = req.depositNumber;
    form.depositMoney = req.depositMoney;
    form.OutCurr = req.OutCurr;
    form.transTypeDesc = req.transTypeDesc;

    // 不可為空，不可formate
    if (typeof form.depositMoney == 'string') {
      form.depositMoney = form.depositMoney.replace(',', '');
    }
    // if (!form.depositMoney || form.depositMoney == '') {
    //   form.depositMoney = '0';
    // }

    // if (form.transTypeDesc === '') {
    //   form.transTypeDesc = '(null)';
    // }
    return super.send(form).then(
      (resObj) => {
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        // let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        if (!jsonObj.hasOwnProperty('result') || jsonObj['result'] != '0') {
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: jsonObj.respCodeMsg
          });
        }
        return Promise.resolve(jsonObj);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}
