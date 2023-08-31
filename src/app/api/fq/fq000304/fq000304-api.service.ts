import { Injectable } from '@angular/core';
import { FQ000304ReqBody } from './fq000304-req';
import { FQ000304ResBody } from './fq000304-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FQ000304ApiService extends ApiBase<FQ000304ReqBody, FQ000304ResBody> {

  constructor(
    public telegram: TelegramService<FQ000304ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'FQ000304');
  }

  send(send_data): Promise<any> {
    let form = new FQ000304ReqBody();
    form.custId = this.authService.getCustId();
    form.startDate = this._formateService.transDate(send_data.startDate, 'yyyyMMdd');
    form.endDate = this._formateService.transDate(send_data.endDate, 'yyyyMMdd');
    form.type = send_data.type;

    return super.send(form).then(
      (resObj) => {
        let output = this._formateService.transClone(resObj);
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');

        output.data = [];
        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
        }
        if (output.data.length <= 0) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.EMPTY',
                data: output,
                dataTime: output.dataTime
            });
        }

        return output;
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}



