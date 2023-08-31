import { Injectable } from '@angular/core';
import { FH000103ResBody } from './fh000103-res';
import { FH000103ReqBody } from './fh000103-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class FH000103ApiService extends ApiBase<FH000103ReqBody, FH000103ResBody> {
  constructor(public telegram: TelegramService<FH000103ResBody>,
    public errorHandler: HandleErrorService,
    private _formateService: FormateService,
    private authService: AuthService
  ) {
    super(telegram, errorHandler, 'FH000103');
  }

  getQuery(set_data: FH000103ReqBody): Promise<any> {
    let output = {
      status: false,
      msg: 'Error',
      info_data: {},
      data: []
    };
    let reqData = new FH000103ReqBody();
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    reqData.custId = userData.custId;
    reqData.personId = set_data.personId;
    reqData.chartNo = set_data.chartNo;
    reqData.birthday = set_data.birthday;

    return super.send(reqData).then(
      (resObj) => {
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.msg = '';

        output.info_data = jsonObj;
        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
            delete output.info_data['details'];
        }
        output.info_data['queryTimeFlag'] = this._formateService.checkField(output.info_data, 'queryTimeFlag');
        output.info_data['trnsAcctNo'] = this._formateService.checkField(output.info_data, 'trnsAcctNo');
        output.info_data['businessType'] = this._formateService.checkField(output.info_data, 'businessType');
        output.info_data['trnsToken'] = this._formateService.checkField(output.info_data, 'trnsToken');
        output.info_data['isMySelfPayment'] = this._formateService.checkField(output.info_data, 'isMySelfPayment');
        output.info_data['details'] = this._formateService.checkField(output.info_data, 'details');

        if (output.data.length <= 0 || output.info_data['details']==null) {
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
