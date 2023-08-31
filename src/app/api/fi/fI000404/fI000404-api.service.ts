import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000404ResBody } from './fI000404-res';
import { FI000404ReqBody } from './fI000404-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000404ApiService extends ApiBase<FI000404ReqBody, FI000404ResBody> {
  constructor(
    public telegram: TelegramService<FI000404ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000404');
  }


  /**
   * 基金單筆申購確認
   * req
   * 
   *   
   *    
   *   
   */
  getData(req: any, page?: number, sort?: Array<any>, reqHeader?: any): Promise<any> {
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
    const data = new FI000404ReqBody();
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
    data.trnsToken = req.trnsToken;
    data.notiCD = req.notiCD;
    data.sLossCD = req.sLossCD;
    data.sLoss = req.sLoss;
    data.sProCD = req.sProCD;
    data.sPro = req.sPro;
    data.branchName = req.branchName;
    data.unitCall = req.unitCall;
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

    return super.send(data, option).then(
      (resObj) => {
        this._logger.step('FUND', 'line 80 api service sucess!!!!!!!!');
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

        // let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        // output.info_data = jsonObj;
        // this._logger.step('FUND', 'line 67 api, jsonObj: ', jsonObj);
        // output.info_data['serviceFee'] = this._formateService.checkField(output.info_data, 'serviceFee'); // 手續費
        // output.info_data['hostCodeMsg'] = this._formateService.checkField(output.info_data, 'hostCodeMsg'); // 主機訊息代碼
        // output.info_data['trnsRsltCode'] = this._formateService.checkField(output.info_data, 'trnsRsltCode'); // 交易結果代碼

        // if (output.info_data['trnsRsltCode'] == '') {
        //   this._logger.step('FUND', 'trnsRsltCode == ''!!!');
        //   return Promise.reject({
        //     title: 'ERROR.TITLE',
        //     content: 'ERROR.RSP_FORMATE_ERROR'
        //   });
        // }
        // 交易結果狀態處理:
        // trnsRsltCode	交易結果代碼 0-交易成功,1-交易失敗,X-交易異常,2-已扣款交易異常請至櫃台處理
        // output.status = false;
        // if (output.info_data['trnsRsltCode']  == '0') {
        //   this._logger.step('FUND', 'trnsRsltCode==0, status true!!!');
        //   output.status = true;
        //   output.msg = '';
        // } else if (output.info_data['trnsRsltCode']  == 'X' || output.info_data['trnsRsltCode']  == '1') {
        //   output.error_type = 'warning';
        // } else {
        //   output.error_type = 'error';
        // }

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
