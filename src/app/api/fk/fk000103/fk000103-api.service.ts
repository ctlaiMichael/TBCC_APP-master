import { Injectable } from '@angular/core';
import { FK000103ReqBody } from './fk000103-req';
import { FK000103ResBody } from './fk000103-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FK000103ApiService extends ApiBase<FK000103ReqBody, FK000103ResBody> {

  constructor(public telegram: TelegramService<FK000103ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService) {
    super(telegram, errorHandler, 'FK000103');
  }

  send(data: FK000103ReqBody): Promise<any> {
    /**
     * EMAIL查詢
     */

    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }

    data.custId = userData.custId;
    return super.send(data).then(
      (resObj) => {

        let output = {
          status: true,
          trnsNo: '',
          trnsDateTime: '',
          msg: ''
        };
        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
        if (telegram.hasOwnProperty('trnsRsltCode') && telegram['trnsRsltCode'] == '0') {
          
          output.trnsDateTime = telegram.trnsDateTime;
          output.trnsNo = telegram.trnsNo;
          output.msg = telegram.hostCodeMsg;
          output.status = true;
          return Promise.resolve(output);

        } else {
          output.msg = telegram.hostCodeMsg;
          output.status = false;
          return Promise.reject(output);
        }

      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



