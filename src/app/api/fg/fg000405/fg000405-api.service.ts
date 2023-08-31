import { Injectable } from '@angular/core';
import { FG000405ReqBody } from './fg000405-req';
import { FG000405ResBody } from './fg000405-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FG000405ApiService extends ApiBase<FG000405ReqBody, FG000405ResBody> {

  constructor(public telegram: TelegramService<FG000405ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService) {
    super(telegram, errorHandler, 'FG000405');
  }
  send(data: FG000405ReqBody): Promise<any> {
    /**
     * 合庫本人可約定帳戶查詢
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
          status: false,
          msg: 'Error',
          data: []
        }
        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};
        if (telegram.hasOwnProperty('canAgreeAccounts') && telegram['canAgreeAccounts'].hasOwnProperty('canAgreeAccount') &&
           telegram['canAgreeAccounts'] && telegram['canAgreeAccounts']['canAgreeAccount'] &&  telegram 
          
          ) {
          output.status = true;
          output.msg = '';
          output.data = this.modifyTransArray(telegram['canAgreeAccounts']['canAgreeAccount']);
          return Promise.resolve(output);
        } else {
          return Promise.reject(output);
        }

      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



