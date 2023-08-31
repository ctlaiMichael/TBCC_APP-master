/**
 * 基金贖回查詢
 * FI000501
 * custId	身分證字號	string	統一編號
 * trnsType	交易類型	string
 *    1: 贖回
 *    2: 贖回(預約)
 *    3: 轉換(一轉一)
 *    4: 轉換(一轉三)
 *    5: 轉換(一轉一) (預約)
 * paginator	分頁器	element
 *
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000501ResBody } from './FI000501-res';
import { FI000501ReqBody } from './FI000501-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FI000501ApiService extends ApiBase<FI000501ReqBody, FI000501ResBody> {
  constructor(
    public telegram: TelegramService<FI000501ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000501');
  }


  /**
   * 基金庫存查詢
   * req
   */
  getData(req: any, page?: number, sort?: Array<any>): Promise<any> {
    const usercustId = this.authService.getCustId();
    const data = new FI000501ReqBody();
    data.custId = usercustId; // user info;
    data.paginator = this.modifyPageReq(data.paginator, page, sort);
    data.trnsType = req;

    return this.send(data).then(
      (resObj) => {
        this._logger.step('FUND', 'testing');
        const output = {
          status: false,
          msg: 'ERROR.DEFAULT',
          info_data: {},
          dataTime: '',
          page_info: {},
          data: []
        };
        const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        const modify_data = this._modifyRespose(jsonObj);
        output.data = modify_data.data;
        output.info_data = modify_data.info_data;
        output.page_info = this.pagecounter(jsonObj);
        // this._logger.step('FUND', 'page_info:', output.page_info);
        // this._logger.step('FUND', 'this.length: ', output.data.length);
        if (output.data.length <= 0) {
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.HASREDEEM_EMPTY'
          });
        }

        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
      },
      (errorObj) => {
        this._logger.error('FUND', 'errorObj');
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
    let check_obj = this.checkObjectList(jsonObj, 'details.detail');
    if (typeof check_obj !== 'undefined') {
        output.data = this.modifyTransArray(check_obj);
        delete output.info_data['details'];
    }

    return output;
  }
}
