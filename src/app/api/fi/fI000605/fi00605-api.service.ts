import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000605ResBody } from './fi000605-res';
import { FI000605ReqBody } from './fi000605-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { TelegramOption } from '@core/telegram/telegram-option';


@Injectable()
export class FI000605ApiService extends ApiBase<FI000605ReqBody, FI000605ResBody> {
  constructor(
    public telegram: TelegramService<FI000605ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000605');
  }


  /**
   * 停損獲利點通知
   * req
   * @param page 頁次
   * @param sort 排序
   */
  getData(req: object, page?: number, sort?: Array<any>, background?: boolean): Promise<any> {
    const custId = this.authService.getCustId();
    if (!custId || custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    let option: TelegramOption = new TelegramOption();
    if (background === true) {
        option.background = true;
    }
    const data = new FI000605ReqBody();
    data.custId = custId; // user info;
    data.paginator = this.modifyPageReq(data.paginator, page, sort);

    return this.send(data, option).then(
      (resObj) => {
        const output = {
          status: false,
          msg: 'ERROR.DEFAULT',
          info_data: {},
          dataTime: '',
          page_info: {},
          data: []
        };
        const jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        const modify_data = this._modifyRespose(jsonObj);
        output.data = modify_data.data;
        output.info_data = modify_data.info_data;
        output.page_info = this.pagecounter(jsonObj);

        if (output.data.length <= 0) {
          // output.msg = 'ERROR.EMPTY';
          // return Promise.reject(output);
          output.status = false;
          output.msg = 'ERROR.EMPTY';
        } else {
          output.status = true;
          output.msg = '';
        }
        return Promise.resolve(output);
      },
      (errorObj) => {
        this._logger.step('FUND', 'errorObj');
        return Promise.reject(errorObj);
      }
    );
  }

  /**
   * Response整理
   * @param jsonObj 資料判斷
   */
  private _modifyRespose(jsonObj) {
    const output = {
      info_data: {},
      data: []
    };
    output.info_data = this._formateService.transClone(jsonObj);
    if (jsonObj.hasOwnProperty('details') && jsonObj['details']
      && jsonObj['details'].hasOwnProperty('detail')
      && jsonObj['details']['detail']
    ) {
      output.data = this.modifyTransArray(jsonObj['details']['detail']);
      delete output.info_data['details'];
    }

    return output;
  }


}
