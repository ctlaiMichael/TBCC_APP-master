/**
 * FI000802-觀察清單
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000802ReqBody } from './fi000802-req';
import { FI000802ResBody } from './fi000802-res';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';


@Injectable()
export class FI000802ApiService extends ApiBase<FI000802ReqBody, FI000802ResBody> {
  constructor(
    public telegram: TelegramService<FI000802ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000802');
  }


  send(data): Promise<any> {

    let set_data = new FI000802ReqBody();

    const custId = this.authService.getCustId();
    if (custId == '' || data.group == '' || data.fundCodes == undefined) {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    set_data.custId = custId;
    set_data.group = data.group;
    set_data.fundCodes = data.fundCodes;

    return super.send(set_data).then(
      (response) => {
        let output = {
          status: false,
          msg: 'Error',
          info_data: {},
          headerTime: ''
        };

        let jsonObj = (response.hasOwnProperty('body')) ? response['body'] : {};
        console.log('jsonObj', jsonObj);

        if (jsonObj.hasOwnProperty('trnsRsltCode') && jsonObj['trnsRsltCode'] == '0') {
          output.status = true;
          output.msg = '';
        }
        return Promise.resolve(output);

      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );

  }


}
