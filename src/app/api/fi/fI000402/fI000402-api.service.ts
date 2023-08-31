import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000402ResBody } from './fI000402-res';
import { FI000402ReqBody } from './fI000402-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000402ApiService extends ApiBase<FI000402ReqBody, FI000402ResBody> {
  constructor(
    public telegram: TelegramService<FI000402ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000402');
  }


  /**
   * 基金庫存明細
   * req
   *
   */
  getData(req: any): Promise<any> {
    const userData = this.authService.getUserInfo();
    this._logger.step('FUND', 'custId1:', userData.custId);

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      this._logger.step('FUND', 'userData undefined');
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new FI000402ReqBody();
    data.custId = userData.custId; // user info;
    data.investType = req.investType;
    data.fundType = req.fundType;
    data.selectfund = req.selectfund;
    data.compCode = req.compCode;
    data.fundCode = req.fundCode;
    this._logger.step('FUND', 'data:',data);

    let output = {
      status: false,
      msg: 'Error',
      info_data: {},
      data1: [], //儲存fundLists，基金列表
      data2: [] //儲存companyLists，基金公司列表
    };

    return super.send(data).then(
      (resObj) => {

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.step('FUND', 'jsonObj:',jsonObj);
        output.info_data = jsonObj;
        this._logger.step('FUND', 'output.info_data:',output.info_data);

        //代表查詢基金列表，fundLists
        if (jsonObj.hasOwnProperty('fundLists') && jsonObj['fundLists'] && typeof jsonObj['fundLists'] === 'object'
          && jsonObj['fundLists'].hasOwnProperty('fundList') && jsonObj['fundLists']['fundList']
          && !(jsonObj.hasOwnProperty('companyLists')) && !(jsonObj['companyLists'])) {
            this._logger.step('FUND', 'line 72, it has fundLists!!!');
          output.data1 = this.modifyTransArray(jsonObj['fundLists']['fundList']);
          this._logger.step('FUND', 'line 74 output:',output);
          this._logger.step('FUND', 'line 75 output.data1.length:',output.data1.length);
        }

        //代表查詢基金公司列表，companyLists
        if (jsonObj.hasOwnProperty('companyLists') && jsonObj['companyLists'] && typeof jsonObj['companyLists'] === 'object'
          && jsonObj['companyLists'].hasOwnProperty('companyList') && jsonObj['companyLists']['companyList']
          && !(jsonObj.hasOwnProperty('fundLists')) && !(jsonObj['fundLists'])) {
            this._logger.step('FUND', 'line 86, it has companyLists!!!');
          output.data2 = this.modifyTransArray(jsonObj['companyLists']['companyList']);
        }

        if (output.data1.length <= 0 && output.data2.length <= 0) {
          this._logger.step('FUND', 'data2.length 0');
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.EMPTY'
          });
        }

        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
      },
      (errorObj) => {
        this._logger.step('FUND', 'get data error!!!');
        return Promise.reject(errorObj);
      }
    );
  }

}
