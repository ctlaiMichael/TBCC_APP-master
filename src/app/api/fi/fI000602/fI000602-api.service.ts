import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000602ResBody } from './FI000602-res';
import { FI000602ReqBody } from './FI000602-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000602ApiService extends ApiBase<FI000602ReqBody, FI000602ResBody> {
  constructor(
    public telegram: TelegramService<FI000602ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000602');
  }


  /**
   * 基金交易預約取消
   * req
   * @param page 頁次
   * @param sort 排序
   */
  getData(req: object, page?: number, sort?: Array<any> , reqHeader?: any): Promise<any> {
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      this._logger.step('FUND', 'userData undefined');
      return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.DATA_FORMAT_ERROR'
        });
    }
    this._logger.step('FUND', 'new FI000602ReqBody');
    const data = new FI000602ReqBody();
    data.custId = userData.custId; // user info;
    this._logger.step('FUND', 'data.custId: ', data.custId);
    data.reserveTransCode = this._formateService.checkField(req, 'reserveTransCode');
    data.trnsToken = this._formateService.checkField(req, 'trnsToken');
    data.branchName = this._formateService.checkField(req, 'branchName');
    data.unitCall = this._formateService.checkField(req, 'unitCall');

    this._logger.step('FUND', 'this.send: ', data);
    this._logger.step('FUND', 'modifySecurityOption[reqHeader]: ', reqHeader);
    const option = this.modifySecurityOption(reqHeader);
    this._logger.step('FUND', 'modifySecurityOption[option]: ', option);

    return this.send(data, option).then(
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

  /**
   * Response整理
   * @param jsonObj 資料判斷
   */
  private _modifyRespose(jsonObj) {
    const output = {
      info_data: {},
      data: []
    };
    output.info_data = this._formateService.transClone(jsonObj);
    if (jsonObj.hasOwnProperty('details') && jsonObj['details']
      && jsonObj['details'].hasOwnProperty('detail')
      && jsonObj['details']['detail']
    ) {
      output.data = this.modifyTransArray(jsonObj['details']['detail']);
      delete output.info_data['details'];
    }

    return output;
  }


}
