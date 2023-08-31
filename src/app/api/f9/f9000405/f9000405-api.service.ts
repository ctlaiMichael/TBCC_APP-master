import { FormateService } from '@shared/formate/formate.service';
import { Injectable } from '@angular/core';
import { F9000405ResBody } from './f9000405-res';
import { F9000405ReqBody } from './f9000405-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F9000405ApiService extends ApiBase<F9000405ReqBody, F9000405ResBody> {

  constructor(
    public telegram: TelegramService<F9000405ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    public _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'F9000405');

  }

  getData(req: any): Promise<any> {
    let data = new F9000405ReqBody();
    const usercustId = this.authService.getCustId();
    data.custId = usercustId;
    data.rep_name = req.rep_name;
    data.txKind = req.txKind;
    data.give_amt = req.give_amt;
    data.give_dur_yymm = req.give_dur_yymm;
    data.apply_trade = req.apply_trade;
    data.metier = req.metier;
    data.metier_sub = req.metier_sub;
    data.m_year = req.m_year;
    data.apply_nt = req.apply_nt;
    data.total_nt = req.total_nt;
    data.expense = req.expense;
    data.kycYn = req.kycYn;
    data.kycLoan_usage = req.kycLoan_usage;
    data.kycOld = req.kycOld;
    data.kycEtch = req.kycEtch;
    data.kycEtchNo = req.kycEtchNo;
    data.kycBankel = req.kycBankel;
    data.kycCard = req.kycCard;
    data.kycPayMo = req.kycPayMo;
    data.kycElamt = req.kycElamt;
    data.kycElmo = req.kycElmo;
    data.kycKo = req.kycKo;

    let output = {
      status: false,
      title: 'ERROR.TITLE',
      msg: 'ERROR.DEFAULT',
      result: '',
      trnsRsltCode: '',
      hostCode: '',
      hostCodeMsg: '',
      classType: 'error',
      info_data: {}
    };
    this._logger.log("api 405 data:",data);
    return super.send(data).then(
      (resObj) => {

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.log('jsonObj:', jsonObj);

        output.result = jsonObj.result;
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
        this._logger.log("api return output:", this._formateService.transClone(output));
        output.status = true;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}




