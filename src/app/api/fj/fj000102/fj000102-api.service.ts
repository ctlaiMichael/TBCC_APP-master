import { Injectable } from '@angular/core';
import { FJ000102ReqBody } from './fj000102-req';
import { FJ000102ResBody } from './fj000102-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FJ000102ApiService extends ApiBase<FJ000102ReqBody, FJ000102ResBody> {

  constructor(public telegram: TelegramService<FJ000102ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'FJ000102');
  }

  send(data: FJ000102ReqBody): Promise<any> {
    const cust_id = this.authService.getCustId();
    if (cust_id == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId = cust_id;
    return super.send(data).then(
      (resObj) => {
        let output: any = {
          status: false,
          msg: '',
          infoData: {},
          applyAcnts: [],
          trnsOutAcnts: [],
          branches: []
        };
        let modify_data = this._modifyRespose(resObj);
        if (!modify_data.info_data || typeof modify_data.info_data != 'object'
          || Object.keys(modify_data.info_data).length <= 0
        ) {
          output.status = false;
          output.msg = '無法取得使用者資料，請稍後再試';
          return Promise.reject(output);
        }
        output.status = true;
        output.infoData = modify_data.info_data;
        output.applyAcnts = modify_data.applyAcnts;
        output.trnsOutAcnts = modify_data.trnsOutAcnts;
        output.branches = modify_data.branches;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }


    /**
     * Response整理
     * @param jsonObj 資料判斷
     */
    private _modifyRespose(resObj) {
      let output = {
          dataTime: '',
          info_data: {},
          applyAcnts: [],
          trnsOutAcnts: [],
          branches: []
      };

      let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
      let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
      output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
      output.info_data = this._formateService.transClone(jsonObj);

      let applyAcnts = this.checkObjectList(jsonObj, 'applyAcnts.applyAcnt');
      if (typeof applyAcnts !== 'undefined') {
          output.applyAcnts = this.modifyTransArray(applyAcnts);
      }
      let trnsOutAcnts = this.checkObjectList(jsonObj, 'trnsOutAcnts.trnsOutAcnt');
      if (typeof trnsOutAcnts !== 'undefined') {
          output.trnsOutAcnts = this.modifyTransArray(trnsOutAcnts);
      }
      let branches = this.checkObjectList(jsonObj, 'branches.branch');
      if (typeof branches !== 'undefined') {
          output.branches = this.modifyTransArray(branches);
      }

      return output;
  }


}



