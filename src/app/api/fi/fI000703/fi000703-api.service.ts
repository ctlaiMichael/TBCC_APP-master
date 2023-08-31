import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000703ResBody } from './FI000703-res';
import { FI000703ReqBody } from './FI000703-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { logger } from '@shared/util/log-util';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';


@Injectable()
export class FI000703ApiService extends ApiBase<FI000703ReqBody, FI000703ResBody> {
  constructor(
    public telegram: TelegramService<FI000703ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000703');
  }


  /**
   * 投資設定查詢
   * req
   * @param page 頁次
   * @param sort 排序
   */
  getData(req: any, page?: number, sort?: Array<any>, reqHeader?: any): Promise<any> {
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    // logger.error('API req', req);
    // let data = new FI000703ReqBody();
    // console.error('send data start', this._formateService.transClone(data));
    // data.custId = userData.custId; // user info;
    // data.trustAcnt = this._formateService.checkField(req, 'trustAcnt');
    // data.transCode = this._formateService.checkField(req, 'transCode');
    // data.fundCode = this._formateService.checkField(req, 'fundCode');
    // data.investAmntFlag = this._formateService.checkField(req, 'investAmntFlag');
    // data.investAmnt = this._formateService.checkField(req, 'investAmnt').replace(',', '');
    // data.payDateFlag = this._formateService.checkField(req, 'payDateFlag');
    // data.payDate1 = this._formateService.checkField(req, 'payDate1');
    // data.payDate2 = this._formateService.checkField(req, 'payDate2');
    // data.payDate3 = this._formateService.checkField(req, 'payDate3');
    // data.payDate4 = this._formateService.checkField(req, 'payDate4');
    // data.payDate5 = this._formateService.checkField(req, 'payDate5');
    // data.payTypeFlag = this._formateService.checkField(req, 'payTypeFlag');
    // data.changeBegin = this._formateService.checkField(req, 'changeBegin');
    // data.changeEnd = this._formateService.checkField(req, 'changeEnd');
    // data.payAcntStatus = this._formateService.checkField(req, 'payAcntStatus');
    // data.payAcnt = this._formateService.checkField(req, 'payAcnt');
    // data.profitAcntFlag = this._formateService.checkField(req, 'profitAcntFlag');
    // data.oriProfitAcnt = this._formateService.checkField(req, 'oriProfitAcnt');
    // data.profitAcnt = this._formateService.checkField(req, 'profitAcnt');
    // data.effectDate = this._formateService.checkField(req, 'effectDate');
    // data.INCurrency = this._formateService.checkField(req, 'INCurrency');
    // data.trnsToken = this._formateService.checkField(req, 'trnsToken');
    // data.payFundFlag = this._formateService.checkField(req,'payFundFlag');
    // data.newFund=this._formateService.checkField(req, 'newFund');
    // data.payDate31 = this._formateService.checkField(req, 'payDate31');
    // data.payDate5W = this._formateService.checkField(req, 'payDate5W');
    // data.payEvaFlag = this._formateService.checkField(req,'payEvaFlag');
    // logger.error('data.decline1 ', data.decline1, this._formateService.checkField(req, 'decline1'))
    // data.decline1 = this._formateService.checkField(req, 'decline1');
    // data.decline1Cd = this._formateService.checkField(req, 'decline1Cd');
    // data.decline2 = this._formateService.checkField(req, 'decline2');
    // data.decline2Cd = this._formateService.checkField(req, 'decline2Cd');
    // data.decline3 = this._formateService.checkField(req, 'decline3');
    // data.decline3Cd = this._formateService.checkField(req, 'decline3Cd');
    // data.decline4 = this._formateService.checkField(req, 'decline4');
    // data.decline4Cd = this._formateService.checkField(req, 'decline4Cd');
    // data.decline5 = this._formateService.checkField(req, 'decline5');
    // data.decline5Cd = this._formateService.checkField(req, 'decline5Cd');
    // data.gain1 = this._formateService.checkField(req, 'gain1');
    // data.gain1Cd = this._formateService.checkField(req, 'gain1Cd');
    // data.gain2 = this._formateService.checkField(req, 'gain2');
    // data.gain2Cd = this._formateService.checkField(req, 'gain2Cd');
    // data.gain3 = this._formateService.checkField(req, 'gain3');
    // data.gain3Cd = this._formateService.checkField(req, 'gain3Cd');
    // data.gain4 = this._formateService.checkField(req, 'gain4');
    // data.gain4Cd = this._formateService.checkField(req, 'gain4Cd');
    // data.gain5 = this._formateService.checkField(req, 'gain5');
    // data.gain5Cd = this._formateService.checkField(req, 'gain5Cd');
    // console.error('send data start', this._formateService.transClone(data));

    // logger.error('API data', data);
    const option = this.modifySecurityOption(reqHeader);
    this._logger.step('FUND', 'modifySecurityOption[option]: ', option);

    return this.send(req, option).then(
      (resObj) => {
        let output: any = {
          status: false,
          msg: 'ERROR.DEFAULT',
          info_data: {},
          dataTime: '',
          data: {}
        };

        let check_res = TransactionApiUtil.modifyResponse(resObj);
        output.status = check_res.status;
        let jsonObj = check_res.body;
        output.info_data = jsonObj;
        output.msg = check_res.msg;
        output.data = check_res;
        return Promise.resolve(output);
      },
      (errorObj) => {
        this._logger.step('FUND', 'errorObj');
        return Promise.reject(errorObj);
      }
    );
  }



}
