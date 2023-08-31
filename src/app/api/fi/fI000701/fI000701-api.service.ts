import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000701ResBody } from './FI000701-res';
import { FI000701ReqBody } from './FI000701-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000701ApiService extends ApiBase<FI000701ReqBody, FI000701ResBody> {
  constructor(
    public telegram: TelegramService<FI000701ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000701');
  }


  /**
   * 定期(不)定額異動查詢
   * req
   *  unitType:
   *    Y: 有庫存
   *    N: 無庫存
   *    A: 全部
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
    const data = new FI000701ReqBody();
    data.custId = userData.custId; // user info;
    this._logger.step('FUND', 'data.custId: ', data.custId);
    data.unitType = this._formateService.checkField(req, 'unitType');
    data.unitType = data.unitType.toLocaleUpperCase();
    this._logger.step('FUND', 'data.unitType: ', data.unitType);
    if (['Y', 'N', 'A'].indexOf(data.unitType) < 0) {
      data.unitType = 'Y';
    }
    data.investType = this._formateService.checkField(req, 'investType');
    if (['1', '2', '3'].indexOf(data.investType) < 0) {
      data.investType = '3';
    }
    // 是否過濾終止扣款註記 Y:要 N:不要
    data.filterFlag = this._formateService.checkField(req, 'filterFlag');
    if (['Y', 'N'].indexOf(data.filterFlag) < 0) {
      data.filterFlag = 'N';
    }
    data.paginator = this.modifyPageReq(data.paginator, page, sort);
    this._logger.step('FUND', 'data.paginator: ', data.paginator);
    this._logger.step('FUND', 'this.send: ', data);


    return this.send(data).then(
      (resObj) => {
        const output = {
          status: false,
          msg: 'ERROR.DEFAULT',
          info_data: {},
          dataTime: '',
          page_info: {},
          data: []
        };
        this._logger.step('FUND', 'body:', userData.hasOwnProperty('body'));
        const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        const modify_data = this._modifyRespose(jsonObj);
        this._logger.step('FUND', 'resObj:', resObj);
        output.data = modify_data.data;
        output.info_data = modify_data.info_data;
        output.page_info = this.pagecounter(jsonObj);
        this._logger.step('FUND', 'page_info:', output.page_info);

        this._logger.step('FUND', 'this.length: ', output.data.length);
        if (output.data.length <= 0) {
          output.msg = 'ERROR.EMPTY';
          return Promise.reject(output);
        }
        output.status = true;
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
      output.data.forEach(element => {
        element['cost']=parseInt(element['cost']);
      });
    }
    return output;
  }


}
