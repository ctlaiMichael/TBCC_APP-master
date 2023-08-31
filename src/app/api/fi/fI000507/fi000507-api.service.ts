import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000507ResBody } from './FI000507-res';
import { FI000507ReqBody } from './FI000507-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000507ApiService extends ApiBase<FI000507ReqBody, FI000507ResBody> {
  constructor(
    public telegram: TelegramService<FI000507ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000507');
  }


  /**
   * 基金轉換申請
   * req
   * @param page 頁次
   * @param sort 排序
   */
  getData(req: object, page?: number, sort?: Array<any> , reqHeader?: any): Promise<any> {
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.DATA_FORMAT_ERROR'
        });
    }
    const data = new FI000507ReqBody();
    data.custId = userData.custId; // user info;
    this._logger.step('FUND', 'data.custId: ', data.custId);
    data.trustAcnt = this._formateService.checkField(req, 'trustAcnt');
    this._logger.step('FUND', 'data.trustAcnt: ', data.trustAcnt);
    data.transCode = this._formateService.checkField(req, 'transCode');
    data.fundCode = this._formateService.checkField(req, 'fundCode');
    data.investType = this._formateService.checkField(req, 'investType');
    data.inCurrency = this._formateService.checkField(req, 'inCurrency');
    data.amount = this._formateService.checkField(req, 'amount').replace(',', '');
    data.unit = this._formateService.checkField(req, 'unit');
    let transAmountOri = this._formateService.checkField(req, 'transAmount');
    data.transAmount = this._formateService.checkField(req, 'transAmount').replace(',', '');
    data.payAcnt = this._formateService.checkField(req, 'payAcnt');
    data.redeemType = this._formateService.checkField(req, 'redeemType');
    data.inFundCode = this._formateService.checkField(req, 'inFundCode');

    return this.send(data).then(
      (resObj) => {
        const output = {
          status: false,
          msg: 'ERROR.DEFAULT',
          info_data: {},
          dataTime: ''
        };

        output.status = true;
        const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.info_data = jsonObj;
        output.msg = '';
        return Promise.resolve(output);
      },
      (errorObj) => {
        this._logger.step('FUND', 'errorObj');
        return Promise.reject(errorObj);
      }
    );
  }



}
