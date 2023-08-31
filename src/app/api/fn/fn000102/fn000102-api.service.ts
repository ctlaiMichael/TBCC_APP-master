import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FN000102ReqBody } from './fn000102-req';
import { FN000102ResBody } from './fn000102-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FN000102ApiService extends ApiBase<FN000102ReqBody, FN000102ResBody> {

  constructor(
    private _formateService: FormateService,
    public telegram: TelegramService<FN000102ResBody>,
    public errorHandler: HandleErrorService) {
      super(telegram, errorHandler, 'FN000102');
    }

  send(data: FN000102ReqBody): Promise<any> {
    return super.send(data).then(
      (fn000102res) => {
        let output = {
          dataTime: '',
          info_data: {},
          applyStatus: '',
          custId: '',
          data: [],
          deviceId: '',
          nocrwdTime: '',
          trnsToken: ''
        };
        let jsonObj = (fn000102res.hasOwnProperty('body')) ? fn000102res['body'] : {};
        let jsonHeader = (fn000102res.hasOwnProperty('header')) ? fn000102res['header'] : {};

        // output = jsonObj; // discard
        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);
        output.custId = jsonHeader.custId;
        output.applyStatus = jsonObj.applyStatus;
        output.deviceId = jsonObj.deviceId;
        output.nocrwdTime = jsonObj.nocrwdTime;
        output.trnsToken = jsonObj.trnsToken;


        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
        }

        return Promise.resolve(output);
      },
      (fn000102err) => {
        return Promise.reject(fn000102err);
      }
    );
  }

}
