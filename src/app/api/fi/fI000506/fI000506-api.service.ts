import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000506ResBody } from './fI000506-res';
import { FI000506ReqBody } from './fI000506-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';


@Injectable()
export class FI000506ApiService extends ApiBase<FI000506ReqBody, FI000506ResBody> {
  constructor(
    public telegram: TelegramService<FI000506ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000506');
  }


  /**
   * 基金贖回確認(預約)
   * req
   */
  getData(req: any, page?: number, sort?: Array<any> , reqHeader?: any): Promise<any> {
    const userData = this.authService.getUserInfo();
    // this._logger.step('FUND', 'custId:', userData.hasOwnProperty('custId'));
    // this._logger.step('FUND', 'custId1:', userData.custId);

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      this._logger.step('FUND', 'userData undefined');
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new FI000506ReqBody();
    data.custId = userData.custId; // user info;
    data.trustAcnt = req.trustAcnt;
    data.transCode = req.transCode;
    data.fundCode = req.fundCode;
    data.investType = req.investType;
    data.currency = req.currency;
    data.inCurrency = req.inCurrency;
    data.amount = req.amount;
    data.unit = req.unit;
    data.redeemAmnt = req.redeemAmnt;
    data.enrollDate = req.enrollDate;
    data.effectDate = req.effectDate;
    data.redeemAcnt = req.redeemAcnt;
    data.redeemType = req.redeemType;
    data.redeemUnit = req.redeemUnit;
    data.trustFee = req.trustFee;
    data.isContinue = req.isContinue;
    data.trnsToken = req.trnsToken;
    data.CDSCrate = req.CDSCrate;
    data.branchName = req.branchName;
    data.unitCall = req.unitCall;
    // this._logger.step('FUND', 'send data: ', data);
    // this._logger.step('FUND', 'modifySecurityOption[reqHeader]: ', reqHeader);
    const option = this.modifySecurityOption(reqHeader);
    // this._logger.step('FUND', 'modifySecurityOption[option]: ', option);

    //2019/09/04,中台只要發單筆預約電文，不會回isContinue欄位，需判斷
    if(!data.hasOwnProperty('isContinue') || typeof data.isContinue ==='undefined' || data.isContinue == null) {
      data.isContinue = '';
    }

    let output: any = {
      status: false,
      title: 'ERROR.TITLE',
      msg: 'ERROR.DEFAULT',
      trnsRsltCode: '',
      hostCode: '',
      hostCodeMsg: '',
      classType: 'error',
      info_data: {}
    };
    this._logger.log("506req,data",data);
    return super.send(data,option).then(
      (resObj) => {
        // this._logger.step('FUND', 'sucess!!!!!!!!');
        const transRes = TransactionApiUtil.modifyResponse(resObj);
        output.status = transRes.status;
        output.title = transRes.title;
        output.msg = transRes.msg;
        output.classType = transRes.classType;
        output.trnsRsltCode = transRes.trnsRsltCode;
        output.hostCode = transRes.hostCode;
        output.hostCodeMsg = transRes.hostCodeMsg;

        // let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.info_data = transRes.body;
        // this._logger.step('FUND', 'line 67 api, jsonObj: ', jsonObj);
        output.info_data['trustFee'] = this._formateService.checkField(output.info_data, 'trustFee'); // 信託管理費
        output.info_data['hostCodeMsg'] = this._formateService.checkField(output.info_data, 'hostCodeMsg'); // 主機訊息代碼
        output.info_data['trnsRsltCode'] = this._formateService.checkField(output.info_data, 'trnsRsltCode'); // 交易結果代碼

        // if (output.info_data['trnsRsltCode'] == '') {
        //   // this._logger.step('FUND', 'trnsRsltCode == ');
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

        // output.status = true;
        // this._logger.step('FUND', 'resolve sucess!!!!!');
        return Promise.resolve(output);
      },
      (errorObj) => {
        // this._logger.step('FUND', 'failed!!!!!!');
        return Promise.reject(errorObj);
      }
    );
  }

}
