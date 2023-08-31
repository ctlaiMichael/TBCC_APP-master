import { Injectable } from '@angular/core';
import { FG000404ReqBody } from './fg000404-req';
import { FG000404ResBody } from './fg000404-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { CacheService } from '@core/system/cache/cache.service';

@Injectable()
export class FG000404ApiService extends ApiBase<FG000404ReqBody, FG000404ResBody> {

  constructor(public telegram: TelegramService<FG000404ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService
		, private _cacheService: CacheService) {
    super(telegram, errorHandler, 'FG000404');
  }
  send(data: FG000404ReqBody,reqHeader): Promise<any> {
    /**
     * 常用帳號設定
     */
    //取身分證
    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty("custId") || userData.custId == '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    data.custId=userData.custId;
    return super.send(data,reqHeader).then(
      (resObj) => {
        let output = {
          status: false,
          msg: '',
          result: '1'
        };

        this._cacheService.removeGroup('account');
        
        let telegram = (resObj.hasOwnProperty('body')) ? resObj.body : {};

     
        if (telegram.hasOwnProperty('result') && telegram['result'] == '0') {
          output.status = true;
          output.result = telegram['result'];
          return Promise.resolve(output);
        } else {
           // output.msg = "處理error";
           //於native code: AddUsuallyUseAcct.java (看到)
           output.msg = '新增帳號失敗';
          return Promise.reject(output);
        }
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}



