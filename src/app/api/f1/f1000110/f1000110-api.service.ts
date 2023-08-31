import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F1000110ResBody } from './f1000110-res';
import { F1000110ReqBody } from './f1000110-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';


@Injectable()
export class F1000110ApiService extends ApiBase<F1000110ReqBody, F1000110ResBody> {
  constructor(
    public telegram: TelegramService<F1000110ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'F1000110');
  }


  /**
   * 9700 法尊 客戶基本資料
   * req
   * @param page 頁次
   * @param sort 排序
   */
  getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new F1000110ReqBody();
    data.custId = userData.custId; // user info;
    data.workingStatus = this._formateService.checkField(req, 'workingStatus');
    data.occupation = this._formateService.checkField(req, 'occupation');
    data.annualIncome = this._formateService.checkField(req, 'annualIncome');
    data.companyName = this._formateService.checkField(req, 'companyName');
    data.jobTitle = this._formateService.checkField(req, 'jobTitle');

    return this.send(data).then(
      (resObj) => {
        const output = {
          status: false,
          title: 'ERROR.TITLE',
          msg: 'ERROR.DEFAULT',
          trnsRsltCode: '',
          hostCode: '',
          hostCodeMsg: '',
          classType: 'error',
          info_data: {}
        };

        output.status = true;
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
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }



}
