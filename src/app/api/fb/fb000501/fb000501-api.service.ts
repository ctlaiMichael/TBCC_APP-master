/**
 * FB000501-最新消息
 * 列表
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000501ResBody } from './fb000501-res';
import { FB000501ReqBody } from './fb000501-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class FB000501ApiService extends ApiBase<FB000501ReqBody, FB000501ResBody> {
  constructor(
    public telegram: TelegramService<FB000501ResBody>,
    public errorHandler: HandleErrorService
    , private _formateService: FormateService
  ) {
    super(telegram, errorHandler, 'FB000501');
  }


  /**
   * 最新消息
   * @param page 頁次
   * @param sort 排序
   */
  getData(page?: number, sort?: Array<any>): Promise<any> {
    let data = new FB000501ReqBody();
    data.paginator = this.modifyPageReq(data.paginator, page, sort);


    return this.send(data).then(
      (resObj) => {
        let output = {
          status: false,
          msg: 'ERROR.DEFAULT',
          info_data: {},
          dataTime: '',
          page_info: {},
          data: []
        };

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let modify_data = this._modifyRespose(jsonObj);
        output.data = modify_data.data;
        output.info_data = modify_data.info_data;
        output.page_info = this.pagecounter(jsonObj);

        if (output.data.length <= 0) {
          output.msg = 'ERROR.EMPTY';
          return Promise.reject(output);
        }
        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

  /**
   * Response整理
   * @param jsonObj 資料判斷
   */
  private _modifyRespose(jsonObj) {
    let output = {
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
