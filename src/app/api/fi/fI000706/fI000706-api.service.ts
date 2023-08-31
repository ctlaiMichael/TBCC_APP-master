import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000706ResBody } from './fI000706-res';
import { FI000706ReqBody } from './fI000706-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000706ApiService extends ApiBase<FI000706ReqBody, FI000706ResBody> {
  constructor(
    public telegram: TelegramService<FI000706ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000706');
  }


  /**
   * 基金停損/獲利設定
   * req
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
    const data = new FI000706ReqBody();
    data.custId = userData.custId; // user info;
    data.trnsToken = req.trnsToken;
    data.details = req.details;
    this._logger.step('FUND', '3 ', data);
    // this._logger.step('FUND', 'modifySecurityOption[reqHeader]: ', reqHeader);
    // const option = this.modifySecurityOption(reqHeader);
    // this._logger.step('FUND', 'modifySecurityOption[option]: ', option);

    let output = {
      status: false,
      title: 'ERROR.TITLE',
      msg: 'ERROR.DEFAULT',
      trnsRsltCode: '',
      hostCode: '',
      hostCodeMsg: '',
      classType: 'error',
      info_data: {},
      data: []
    };

    this._logger.step('FUND', 'line 55 api service send data:', data);
    return super.send(data).then(
      (resObj) => {
        this._logger.step('FUND', 'sucess!!!!!!!!');

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

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

        if (jsonObj.hasOwnProperty('rdetails') && jsonObj['rdetails']
          && typeof jsonObj['rdetails'] === 'object' && jsonObj['rdetails'].hasOwnProperty('detail')) {
          output['data'] = this.modifyTransArray(jsonObj['rdetails']['detail']);
        }

        output.status = true;
        this._logger.step('FUND', 'resolve sucess!!!!!');
        return Promise.resolve(output);
      },
      (errorObj) => {
        this._logger.step('FUND', 'failed!!!!!!');
        this._logger.step('FUND', 'line 98 errorObj:', errorObj);
        return Promise.reject(errorObj);
      }
    );
  }

}
