import { Injectable } from '@angular/core';
import { FQ000402ReqBody } from './fq000402-req';
import { FQ000402ResBody } from './fq000402-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';

@Injectable()
export class FQ000402ApiService extends ApiBase<FQ000402ReqBody, FQ000402ResBody> {

  constructor(public telegram: TelegramService<FQ000402ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'FQ000402');
  }


  send(data: FQ000402ReqBody): Promise<any> {
    /**
     * 參數處理
     */
    let set_data = new FQ000402ReqBody();
    set_data = {...set_data, ...data};
    set_data.custId = this.authService.getCustId();
    if (!set_data.custId || set_data.custId == '') {
        return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.DATA_FORMAT_ERROR'
        });
    }
    set_data.bankNo = '006';

    return super.send(set_data).then(
      (response) => {
        let output = EpayApiUtil.modifyInvoiceResponse(response);
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );

  }



}



