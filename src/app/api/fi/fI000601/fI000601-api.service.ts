import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000601ResBody } from './FI000601-res';
import { FI000601ReqBody } from './FI000601-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000601ApiService extends ApiBase<FI000601ReqBody, FI000601ResBody> {
  constructor(
    public telegram: TelegramService<FI000601ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000601');
  }


  /**
   * 基金預約交易查詢
   * req
   *  status: (交易狀況)
   *    A: 全部
   *    B: 已處理(全部)
   *    C: 待處理
   *    D: 已取消
   *    E: 已處理(成功)
   *    F: 已處理(失敗)
   *  transType: (交易項目)
   *    A: 全部
   *    B: 單筆申購
   *    C: 贖回
   *    D: 轉換
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
    const data = new FI000601ReqBody();
    data.custId = userData.custId; // user info;
    // 轉民國年
    // tslint:disable-next-line:max-line-length
    data.startDate = this._formateService.transDate(this._formateService.checkField(req, 'startDate'), { formate: 'yyyMMdd', chinaYear: true });
    data.endDate = this._formateService.transDate(this._formateService.checkField(req, 'endDate'), { formate: 'yyyMMdd', chinaYear: true });

    data.status = this._formateService.checkField(req, 'status');
    this._logger.step('FUND', 'data.status: ', data.status);
    data.transType = this._formateService.checkField(req, 'transType');
    data.transType = data.transType.toLocaleUpperCase();
    this._logger.step('FUND', 'data.transType: ', data.transType);
    if (['A', 'B', 'C', 'D'].indexOf(data.transType) < 0) {
      data.transType = 'A';
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
        this._logger.step('FUND', 'output:', output);

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
      delete output.info_data['details'];
    }

    return output;
  }


}
