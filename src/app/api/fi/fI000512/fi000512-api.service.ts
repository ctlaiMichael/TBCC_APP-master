import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000512ResBody } from './FI000512-res';
import { FI000512ReqBody } from './FI000512-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000512ApiService extends ApiBase<FI000512ReqBody, FI000512ResBody> {
  constructor(
    public telegram: TelegramService<FI000512ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000512');
  }


  /**
   * 基金轉換確認
   * req
   * @param page 頁次
   * @param sort 排序
   */
  getData(req: object, page?: number, sort?: Array<any> , reqHeader?: any): Promise<any> {
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      this._logger.step('FUND', 'userData undefined');
      return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.DATA_FORMAT_ERROR'
        });
    }
    this._logger.step('FUND', 'new FI000512ReqBody2');
    const data = new FI000512ReqBody();
    data.custId = userData.custId; // user info;
    this._logger.step('FUND', 'data.custId: ', data.custId);
    data.trustAcnt = this._formateService.checkField(req, 'trustAcnt');
    this._logger.step('FUND', 'data.trustAcnt: ', data.trustAcnt);
    data.transCode = this._formateService.checkField(req, 'transCode');
    data.fundCode = this._formateService.checkField(req, 'fundCode');
    data.investType = this._formateService.checkField(req, 'investType');
    data.currency = this._formateService.checkField(req, 'currency');
    data.inCurrency = this._formateService.checkField(req, 'inCurrency');
    data.amount = this._formateService.checkField(req, 'amount').replace(',', '');
    data.unit = this._formateService.checkField(req, 'unit');
    data.outAmount1 = this._formateService.checkField(req, 'outAmount1').replace(',', '');
    data.outAmount2 = this._formateService.checkField(req, 'outAmount2').replace(',', '');
    data.outAmount3 = this._formateService.checkField(req, 'outAmount3').replace(',', '');
    data.outUnit1 = this._formateService.checkField(req, 'outUnit1');
    data.outUnit2 = this._formateService.checkField(req, 'outUnit2');
    data.outUnit3 = this._formateService.checkField(req, 'outUnit3');
    data.enrollDate = this._formateService.checkField(req, 'enrollDate');
    data.effectDate = this._formateService.checkField(req, 'effectDate');
    data.payAccount = this._formateService.checkField(req, 'payAccount');
    data.redeemType = this._formateService.checkField(req, 'redeemType');
    data.inFundCode1 = this._formateService.checkField(req, 'inFundCode1');
    data.inFundCode2 = this._formateService.checkField(req, 'inFundCode2');
    data.inFundCode3 = this._formateService.checkField(req, 'inFundCode3');
    data.bankSrvFee1 = this._formateService.checkField(req, 'bankSrvFee1');
    data.bankSrvFee2 = this._formateService.checkField(req, 'bankSrvFee2');
    data.bankSrvFee3 = this._formateService.checkField(req, 'bankSrvFee3');
    data.fndComSrvFee1 = this._formateService.checkField(req, 'fndComSrvFee1');
    data.fndComSrvFee2 = this._formateService.checkField(req, 'fndComSrvFee2');
    data.fndComSrvFee3 = this._formateService.checkField(req, 'fndComSrvFee3');
    data.trnsToken = this._formateService.checkField(req, 'trnsToken');
    data.branchName = this._formateService.checkField(req, 'branchName');
    data.unitCall = this._formateService.checkField(req, 'unitCall');

    const option = this.modifySecurityOption(reqHeader);
    this._logger.step('FUND', 'modifySecurityOption[option]: ', option);

    return this.send(data, option).then(
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
