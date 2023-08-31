/**
 * 贖回轉換約定帳號查詢
 * 1: 贖回
 * 2: 贖回(預約)
 * 3: 轉換(一轉一)
 * 4: 轉換(一轉三)
 * 5: 轉換(一轉一) (預約)
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000502ResBody } from './FI000502-res';
import { FI000502ReqBody } from './FI000502-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000502ApiService extends ApiBase<FI000502ReqBody, FI000502ResBody> {
  constructor(
    public telegram: TelegramService<FI000502ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000502');
  }


  /**
   * 贖回轉換約定帳號查詢
   * req
   */
  getData(req: any): Promise<any> {
    const userData = this.authService.getUserInfo();
    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new FI000502ReqBody();
    data.custId = userData.custId; // user info;
    data.trnsType = this._formateService.checkField(req, 'trnsType');
    data.currency = this._formateService.checkField(req, 'currency');
    // this._logger.step('FUND', 'this.send: ', data);

    if (data.trnsType != '1' && data.trnsType != '2') {
      // 贖回才需要幣別
      data.currency = '';
    }

    return this.send(data).then(
      (resObj) => {
        let output: any = {
          status: false,
          msg: 'ERROR.DEFAULT',
          info_data: {},
          dataTime: '',
          data: []
        };

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.info_data = jsonObj;

        // 儲存約定扣款帳號列表
        let check_obj = this.checkObjectList(jsonObj, 'trnsAccts.trnsAcct');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
            // delete output.info_data['trnsAccts'];
        }

        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
      },
      (errorObj) => {
        this._logger.error('FUND', 'FI000502 errorObj', errorObj);
        return Promise.reject(errorObj);
      }
    );
  }



}
