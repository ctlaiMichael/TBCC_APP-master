/**
 * 推薦人設定
 */
import { Injectable } from '@angular/core';
import { FQ000108ReqBody } from './fq000108-req';
import { FQ000108ResBody } from './fq000108-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FQ000108ApiService extends ApiBase<FQ000108ReqBody, FQ000108ResBody> {

  constructor(
    public telegram: TelegramService<FQ000108ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'FQ000108');
  }

  send(data: FQ000108ReqBody): Promise<any> {
    /**
     * 參數處理
     */
    let set_data = new FQ000108ReqBody();
    set_data.custId = this.authService.getCustId();
    if (!data.hasOwnProperty('employNo') || !data.employNo || data.employNo == '') {
        return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.DATA_FORMAT_ERROR'
        });
    }
    set_data.employNo=data.employNo;

    return super.send(set_data).then(
      (response) => {
        let output = EpayApiUtil.modifyResponse(response);
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );

  }


}



