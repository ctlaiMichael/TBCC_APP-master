import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000704ResBody } from './FI000704-res';
import { FI000704ReqBody } from './FI000704-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000704ApiService extends ApiBase<FI000704ReqBody, FI000704ResBody> {
  constructor(
    public telegram: TelegramService<FI000704ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000704');
  }


  /**
   * 變更現金收益存入帳號
   * req
   * @param page 頁次
   * @param sort 排序
   */
  getData(req: object, page?: number, sort?: Array<any> , reqHeader?: any): Promise<any> {
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.DATA_FORMAT_ERROR'
        });
    }
    this._logger.step('FUND', 'new FI000704ReqBody');
    const data = new FI000704ReqBody();
    data.custId = userData.custId; // user info;
    this._logger.step('FUND', '704 req: ', req);
    data.trustAcnt = this._formateService.checkField(req, 'trustAcnt');
    data.transCode = this._formateService.checkField(req, 'transCode');
    data.fundCode = this._formateService.checkField(req, 'fundCode');
    data.INCurrency = this._formateService.checkField(req, 'INCurrency');
    if (this._formateService.checkField(req, 'amount') == null || this._formateService.checkField(req, 'amount') == '' ) {
      data.amount = '0';
    } else {
      data.amount = this._formateService.checkField(req, 'amount').replace(',', '');
    }
    if (this._formateService.checkField(req, 'unit') == null || this._formateService.checkField(req, 'unit') == '' ) {
      data.unit = '0';
    } else {
      data.unit = this._formateService.checkField(req, 'unit').replace(',', '');
    }
    data.oriProfitAcnt = this._formateService.checkField(req, 'oriProfitAcnt');
    data.profitAcnt = this._formateService.checkField(req, 'profitAcnt');
    data.trnsToken = this._formateService.checkField(req, 'trnsToken');

    this._logger.step('FUND', 'this.send: ', data);
    const option = this.modifySecurityOption(reqHeader);
    this._logger.step('FUND', 'modifySecurityOption[option]: ', option);

    return this.send(data , option).then(
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
