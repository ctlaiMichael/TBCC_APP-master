import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FN000103ReqBody } from './fn000103-req';
import { FN000103ResBody } from './fn000103-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FN000103ApiService extends ApiBase<FN000103ReqBody, FN000103ResBody> {

  constructor(
    public telegram: TelegramService<FN000103ResBody>,
    private _formateService: FormateService,
    public errorHandler: HandleErrorService) {
      super(telegram, errorHandler, 'FN000103');
    }

  send(data: FN000103ReqBody, security: any): Promise<any> {
    let reqHeader = new TelegramOption();
    if (typeof security !== 'undefined' && security) {
      reqHeader.header = security;
    } else {
        return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.DATA_FORMAT_ERROR'
        });
    }
    return super.send(data, reqHeader).then(
      (fn000103res) => {
        let output = {
          dataTime: '',
          info_data: {},
          custId: '',
          data: [],
          mailType: '',
        };

        let jsonObj = (fn000103res.hasOwnProperty('body')) ? fn000103res['body'] : {};
        let jsonHeader = (fn000103res.hasOwnProperty('header')) ? fn000103res['header'] : {};

        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);
        output.custId = jsonHeader.custId;
        output.mailType = jsonObj.mailType;


        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
        }

        return Promise.resolve(output);
      },
      (fn000103err) => {
        return Promise.reject(fn000103err);
      }
    );
  }

}
