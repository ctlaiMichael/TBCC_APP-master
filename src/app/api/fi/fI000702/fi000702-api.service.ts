import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000702ResBody } from './FI000702-res';
import { FI000702ReqBody } from './FI000702-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000702ApiService extends ApiBase<FI000702ReqBody, FI000702ResBody> {
  constructor(
    public telegram: TelegramService<FI000702ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000702');
  }


  /**
   * 投資設定查詢
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
    this._logger.step('FUND', 'new FI000702ReqBody2');
    const data = new FI000702ReqBody();
    data.custId = userData.custId; // user info;
    data.trustAcnt = this._formateService.checkField(req, 'trustAcnt');
    this._logger.step('FUND', 'data.trustAcnt: ', data.trustAcnt);
    data.transCode = this._formateService.checkField(req, 'transCode');
    data.fundCode = this._formateService.checkField(req, 'fundCode');
    data.cost = this._formateService.checkField(req, 'cost');
    return this.send(data).then(
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
