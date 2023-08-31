import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000408ResBody } from './fI000408-res';
import { FI000408ReqBody } from './fI000408-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000408ApiService extends ApiBase<FI000408ReqBody, FI000408ResBody> {
  constructor(
    public telegram: TelegramService<FI000408ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000408');
  }


  /**
   * 基金小額申購確認
   * req
   */
  getData(req: any, page?: number, sort?: Array<any> , reqHeader?: any): Promise<any> {
    const userData = this.authService.getUserInfo();
    this._logger.step('FUND', 'custId:', userData.hasOwnProperty('custId'));
    this._logger.step('FUND', 'custId1:', userData.custId);

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      this._logger.step('FUND', 'userData undefined');
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new FI000408ReqBody();
    data.custId = userData.custId; // user info;
    data.trustAcnt = req.trustAcnt;
    data.fundCode = req.fundCode;
    data.fundType = req.fundType;
    data.amount = req.amount;
    data.payAcnt = req.payAcnt;
    data.salesId = req.salesId;
    data.salesName = req.salesName;
    data.introId = req.introId;
    data.introName = req.introName;
    data.enrollDate = req.enrollDate;
    data.effectDate = req.effectDate;
    data.currency = req.currency;
    data.baseRate = req.baseRate;
    data.favorRate = req.favorRate;
    data.serviceFee = req.serviceFee;
    data.payDate = req.payDate;
    data.payDateS = req.payDateS;
    data.code = req.code;
    data.trnsToken = req.trnsToken;
    this._logger.step('FUND', 'send data: ', data);
    this._logger.step('FUND', 'modifySecurityOption[reqHeader]: ', reqHeader);
    const option = this.modifySecurityOption(reqHeader);
    this._logger.step('FUND', 'modifySecurityOption[option]: ', option);

    let output = {
      status: false,
      title: 'ERROR.TITLE',
      msg: 'ERROR.DEFAULT',
      trnsRsltCode: '',
      hostCode: '',
      hostCodeMsg: '',
      classType: 'error',
      info_data: {}
    };

    return super.send(data,option).then(
      (resObj) => {
        this._logger.step('FUND', 'sucess!!!!!!!!');

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.step('FUND', 'line 67 api, jsonObj: ', jsonObj);

        const transRes = TransactionApiUtil.modifyResponse(resObj);
        let telegram = transRes.body;
        output.status = transRes.status;
        output.title = transRes.title;
        output.msg = transRes.msg;
        output.classType = transRes.classType;
        output.trnsRsltCode = transRes.trnsRsltCode;
        output.hostCode = transRes.hostCode;
        output.hostCodeMsg = transRes.hostCodeMsg;

        output.info_data = telegram;
        output.info_data['trnsRsltCode'] = output.trnsRsltCode;
        output.info_data['hostCode'] = output.hostCode;
        output.info_data['hostCodeMsg'] = output.hostCodeMsg;
        this._logger.step('FUND', 'line 96 output:',output);
        output.status = true;
        this._logger.step('FUND', 'resolve sucess!!!!!');
        return Promise.resolve(output);
      },
      (errorObj) => {
        this._logger.step('FUND', 'failed!!!!!!');
        return Promise.reject(errorObj);
      }
    );
  }

}
