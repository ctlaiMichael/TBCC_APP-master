/**
 * FI000712-信託契約換約申請
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000712ResBody } from './FI000712-res';
import { FI000712ReqBody } from './FI000712-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';


@Injectable()
export class FI000712ApiService extends ApiBase<FI000712ReqBody, FI000712ResBody> {
  constructor(
    public telegram: TelegramService<FI000712ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000712');
  }


  send(data: FI000712ReqBody): Promise<any> {
    /**
     * 參數處理
     */
    let set_data = new FI000712ReqBody();
    const custId = this.authService.getCustId();
    if (custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    set_data.custId = custId;
     // YYYYMMDD(民國年) => 01080101
    let enrollDate = this._formateService.transDate('NOW_TIME', { formate: 'yyyyMMdd', chinaYear: true });
    set_data.enrollDate = enrollDate;


    return super.send(set_data).then(
      (response) => {
        let output = TransactionApiUtil.modifyResponse(response);
        // msg已含host code
        output.msg = output.hostCodeMsg;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );

  }


}
