import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000705ResBody } from './FI000705-res';
import { FI000705ReqBody } from './FI000705-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { OutletContext } from '@angular/router';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000705ApiService extends ApiBase<FI000705ReqBody, FI000705ResBody> {
  constructor(
    public telegram: TelegramService<FI000705ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000705');
  }


  /**
   * 停損/獲利點設定查詢
   * req
   */
  getData(req: object): Promise<any> {
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      this._logger.step('FUND', 'userData undefined');
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new FI000705ReqBody();
    data.custId = userData.custId; // user info;
    this._logger.step('FUND', 'data.custId: ', data.custId);

    return this.send(data).then(
      (resObj) => {
        this._logger.step('FUND', 'resObj into!');
        const output = {
          status: false,
          msg: 'ERROR.DEFAULT',
          info_data: {},
          data: []
        };

        output.status = true;
        const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.info_data = jsonObj;
        if (jsonObj.hasOwnProperty('details') && jsonObj['details'] && typeof jsonObj['details'] === 'object'
          && jsonObj['details'].hasOwnProperty('detail')
          && jsonObj['details']['detail']
        ) {
          output.data = this.modifyTransArray(jsonObj['details']['detail']);
        }
        // 每一筆的某些欄位，中台有可能回null，需做處理轉成字串
        output.data.forEach(item => {
          item['trustAcnt'] = this._formateService.checkField(output.data, 'trustAcnt');
          item['code'] = this._formateService.checkField(output.data, 'code');
        });
        this._logger.step('FUND', 'line 66 api 705 output:', output);

        if (output.data.length <= 0) {
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.EMPTY'
          });
        }
        output.msg = '';
        output.status = true;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}
