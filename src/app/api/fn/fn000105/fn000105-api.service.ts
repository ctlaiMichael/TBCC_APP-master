import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FN000105ReqBody } from './fn000105-req';
import { FN000105ResBody } from './fn000105-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FN000105ApiService extends ApiBase<FN000105ReqBody, FN000105ResBody> {

  constructor(
    public _authService: AuthService,
    private _formateService: FormateService,
    public telegram: TelegramService<FN000105ResBody>,
    public errorHandler: HandleErrorService) {
      super(telegram, errorHandler, 'FN000105');
    }

  /**
   * 取得預約紀錄清單
   * @param {number} [page]                頁次
   * @param {Array<any>} [sort]            排序方式
   * @param {(string | number)} [pageSize] 總筆數
   * @returns {Promise <any>}
   * @memberof FN000105ApiService
   */
  getPageData(page?: number, sort?: Array<any>, pageSize?: string | number): Promise <any> {
    let data: FN000105ReqBody = new FN000105ReqBody();
    const userData = this._authService.getUserInfo();

    // 檢核上行欄位資料格式
    if (!userData.hasOwnProperty('custId') || userData.custId == '') {
      return Promise.reject({
          title: 'ERROR.TITLE',
          content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }

    // FN000105 上行欄位
    data.custId = userData.custId;
    data.recType = 'Q';
    data.paginator = this.modifyPageReq(data.paginator, page, sort);
    if (typeof pageSize != 'undefined') {
      data.paginator.pageSize = pageSize.toString();
    }

    return this.send(data).then(
      (S) => {
        let output = {
          status: false,
          msg: 'ERROR.RSP_FORMATE_ERROR',
          info_data: {},
          data: [],
          page_info: {},
          totalPages: 1,
          dataTime: ''
        };

        let modify_data = this._modifyRespose(S);
        output.dataTime = modify_data.dataTime;
        output.info_data = modify_data.info_data;
        output.data = modify_data.data;
        output.page_info = modify_data.page_info;
        output.totalPages = output.page_info['totalPages'];
        output.status = true;
        output.msg = '';

        return Promise.resolve(output);
      },
      (F) => {
        let output = {
          status: false,
          msg: 'ERROR.RSP_FORMATE_ERROR',
          info_data: {},
          data: [],
          error: F.resultData.body,
          page_info: {},
          totalPages: 1,
          dataTime: ''
        };

        let modify_data = this._modifyRespose(F);
        output.dataTime = modify_data.dataTime;
        output.info_data = modify_data.info_data;
        output.data = modify_data.data;
        output.page_info = modify_data.page_info;
        output.totalPages = output.page_info['totalPages'];
        output.status = false;

        return Promise.reject(output);
      }
    );
  }

  private _modifyRespose(resObj) {
    let output = {
        dataTime: '',
        info_data: {},
        data: [],
        page_info: {}
    };
    let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
    let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
    if (resObj.hasOwnProperty('resultData')) {
      jsonHeader = (resObj.resultData.hasOwnProperty('header')) ? resObj['resultData']['header'] : {};
    }
    output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
    output.info_data = this._formateService.transClone(jsonObj);

    let check_obj = this.checkObjectList(jsonObj, 'details.detail');
    if (typeof check_obj !== 'undefined') {
        output.data = this.modifyTransArray(check_obj);
    }

    output.page_info = this.pagecounter(jsonObj);
    return output;
  }

}
