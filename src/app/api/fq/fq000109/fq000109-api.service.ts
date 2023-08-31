/**
 * 推薦人查詢
 */
import { Injectable } from '@angular/core';
import { FQ000109ReqBody } from './fq000109-req';
import { FQ000109ResBody } from './fq000109-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FQ000109ApiService extends ApiBase<FQ000109ReqBody, FQ000109ResBody> {

  constructor(
    public telegram: TelegramService<FQ000109ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'FQ000109');
  }


  send(data: FQ000109ReqBody): Promise<any> {
    /**
     * 參數處理
     */
    let set_data = new FQ000109ReqBody();
    set_data.custId = this.authService.getCustId();

    return super.send(set_data).then(
      (response) => {
        let output = {
          haveNo: false,
          employNo: '',
          checkObj: null
        };
        output.checkObj = EpayApiUtil.modifyResponse(response);
        output['employNo'] = this._formateService.checkField(output.checkObj.body, 'employNo');
        if (output['employNo'] !== '' && typeof output['employNo'] != 'object') {
          output.haveNo = true;
        }
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



