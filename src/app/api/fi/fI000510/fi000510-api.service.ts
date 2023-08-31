import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000510ResBody } from './FI000510-res';
import { FI000510ReqBody } from './FI000510-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000510ApiService extends ApiBase<FI000510ReqBody, FI000510ResBody> {
  constructor(
    public telegram: TelegramService<FI000510ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000510');
  }


  /**
   * 基金轉換確認(預約)
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
    this._logger.step('FUND', 'new FI000510ReqBody2');
    const data = new FI000510ReqBody();
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
    data.outAmount = this._formateService.checkField(req, 'outAmount').replace(',', '');
    data.outUnit = this._formateService.checkField(req, 'outUnit');
    data.enrollDate = this._formateService.checkField(req, 'enrollDate');
    data.effectDate = this._formateService.checkField(req, 'effectDate');
    data.payAccount = this._formateService.checkField(req, 'payAccount');
    data.redeemType = this._formateService.checkField(req, 'redeemType');
    data.inFundCode = this._formateService.checkField(req, 'inFundCode');
    data.bankSrvFee = this._formateService.checkField(req, 'bankSrvFee');
    data.fndComSrvFee = this._formateService.checkField(req, 'fndComSrvFee');
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
