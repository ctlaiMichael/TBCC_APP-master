/**
 * 信用卡轉出帳號
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F8000402ResBody } from './f8000402-res';
import { F8000402ReqBody } from './f8000402-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class F8000402ApiService extends ApiBase<F8000402ReqBody, F8000402ResBody> {
  constructor(
    public telegram: TelegramService<F8000402ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
    , private _handleError: HandleErrorService
    , private _logger: Logger
  ) {
    super(telegram, errorHandler, 'F8000402');
  }


  /**
   * 查詢轉出帳號
   * req
   */
  getData(req: any): Promise<any> {
    const userData = this.authService.getUserInfo();
    this._logger.step('FUND', 'custId:', userData.custId);

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new F8000402ReqBody();
    data.custId = userData.custId; // user info;

    let output = {
      status: false,
      msg: 'ERROR.RSP_FORMATE_ERROR',
      info_data: {}, // 儲存API
      data: [] //存帳號
    };

    return super.send(data).then(
      (resObj) => {
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.info_data = jsonObj;
        let check_obj = this.checkObjectList(jsonObj, 'trnsOutAccts.detail');
        if (typeof check_obj !== 'undefined') {
          output.data = this.modifyTransArray(check_obj);
          delete output.info_data['trnsOutAccts'];
        }
        output.info_data['businessType'] = this._formateService.checkField(output.info_data, 'businessType');
        output.info_data['trnsToken'] = this._formateService.checkField(output.info_data, 'trnsToken');
        output.info_data['trnsOutAccts'] = this._formateService.checkField(output.info_data, 'trnsOutAccts');
        if (output.data.length <= 0 || output.info_data['trnsOutAccts']==null) {
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
        this._logger.log("errorObj:", errorObj);
        return Promise.reject(errorObj);
      }
    );
  }
}

