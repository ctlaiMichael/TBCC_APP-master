import { FormateService } from '@shared/formate/formate.service';
import { Injectable } from '@angular/core';
import { F9000402ResBody } from './f9000402-res';
import { F9000402ReqBody } from './f9000402-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F9000402ApiService extends ApiBase<F9000402ReqBody, F9000402ResBody> {

  constructor(
    public telegram: TelegramService<F9000402ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    public _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'F9000402');

  }

  getData(setData: any, page?: number, sort?: Array<any>): Promise<any> {
    let data = new F9000402ReqBody();
    const usercustId = this.authService.getCustId();
    data.custId = usercustId;
    data.incirid = usercustId;
    data.paginator = this.modifyPageReq(data.paginator, page, sort);

    let output = {
      status: false,
      msg: 'ERROR.RSP_FORMATE_ERROR',
      info_data: {}, // 儲存API
      data: [], //存帳號
      page_info: {}
    };

    return super.send(data).then(
      (resObj) => {
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.info_data = jsonObj;
        output.page_info = this.pagecounter(jsonObj);
        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
          output.data = this.modifyTransArray(check_obj);
          delete output.info_data['details'];
        }
        output.info_data['businessType'] = this._formateService.checkField(output.info_data, 'businessType');
        output.info_data['trnsToken'] = this._formateService.checkField(output.info_data, 'trnsToken');
        output.info_data['trnsOutAccts'] = this._formateService.checkField(output.info_data, 'trnsOutAccts');
        if (output.data.length <= 0) {
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
        return Promise.reject(errorObj);
      }
    );
  }
}




