/**
 * 繳納本人信用卡款
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F8000401ResBody } from './f8000401-res';
import { F8000401ReqBody } from './f8000401-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';


@Injectable()
export class F8000401ApiService extends ApiBase<F8000401ReqBody, F8000401ResBody> {
  constructor(
    public telegram: TelegramService<F8000401ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
    , private _handleError: HandleErrorService
    , private _logger: Logger
  ) {
    super(telegram, errorHandler, 'F8000401');
  }


  /**
   * 查詢轉出帳號
   * req
   */
  getData(req, reqHeader): Promise<any> {
    const userData = this.authService.getUserInfo();
    this._logger.step('FUND', 'custId:', userData.custId);

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new F8000401ReqBody();
    data.custId = userData.custId; // user info;
    data.trnsfrOutAccnt = req.trnsfrOutAccnt;
    data.trnsfrAmount = req.trnsfrAmount;
    data.businessType = req.businessType;
    data.trnsToken = req.trnsToken;
    const option = this.modifySecurityOption(reqHeader);
    this._logger.log("401 api send data:", data);

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
        this._logger.log('jsonObj:', jsonObj);

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

