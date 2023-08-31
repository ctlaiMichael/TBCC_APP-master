import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000710ResBody } from './fI000710-res';
import { FI000710ReqBody } from './fI000710-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000710ApiService extends ApiBase<FI000710ReqBody, FI000710ResBody> {
  constructor(
    public telegram: TelegramService<FI000710ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000710');
  }


  /**
   * 基金小額申購確認-新基金主機
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
    let data = new FI000710ReqBody();
    // 塞api request
    data.custId = userData.custId; // user info;
    data.trnsToken = req.trnsToken;
    data.trustAcnt = req.trustAcnt;
    data.fundCode = req.fundCode;
    data.enrollDate = req.enrollDate;
    data.currency = req.currency;
    data.amount = req.amount;
    data.payAcnt = req.payAcnt;
    data.effectDate = req.effectDate;
    data.baseRate = req.baseRate;
    data.favorRate = req.favorRate;
    data.serviceFee = req.serviceFee;
    data.fundType = req.fundType;
    data.investAttribute = req.investAttribute;
    data.riskLvl = req.riskLvl;
    data.okCode = req.okCode;
    data.prospectus = req.prospectus;
    data.payDateS = req.payDateS;
    data.salesId = req.salesId;
    data.salesName = req.salesName;
    data.introId = req.introId;
    data.introName = req.introName;
    data.branchName = req.branchName;
    data.unitCall = req.unitCall;
    data.code = req.code;
    data.payDate31 = req.payDate31;
    data.payDate5W = req.payDate5W;
    data.notiCD = req.notiCD;
    data.sLossCD = req.sLossCD;
    data.sLoss = req.sLoss;
    data.sProCD = req.sProCD;
    data.sPro = req.sPro;
    data.continue = req.continue;
    data.decline1Cd = req.decline1Cd;
    data.decline1 = req.decline1;
    data.decline2Cd = req.decline2Cd;
    data.decline2 = req.decline2;
    data.decline3Cd = req.decline3Cd;
    data.decline3 = req.decline3;
    data.decline4Cd = req.decline4Cd;
    data.decline4 = req.decline4;
    data.decline5Cd = req.decline5Cd;
    data.decline5 = req.decline5;
    data.gain1Cd = req.gain1Cd;
    data.gain1 = req.gain1;
    data.gain2Cd = req.gain2Cd;
    data.gain2 = req.gain2;
    data.gain3Cd = req.gain3Cd;
    data.gain3 = req.gain3;
    data.gain4Cd = req.gain4Cd;
    data.gain4 = req.gain4;
    data.gain5Cd = req.gain5Cd;
    data.gain5 = req.gain5;
    const option = this.modifySecurityOption(reqHeader);
    this._logger.step('FUND', 'data.custId: ', data.custId);
    this._logger.step('FUND', 'line 99 api service data send:', data);

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

    return super.send(data, option).then(
      (resObj) => {

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
        this._logger.step('FUND', 'line 96 output:', output);
        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}
