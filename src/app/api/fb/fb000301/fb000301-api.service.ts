import { Injectable } from '@angular/core';
import { FB000301ResBody } from './fb000301-res';
import { FB000301ReqBody } from './fb000301-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FB000301ApiService extends ApiBase<FB000301ReqBody, FB000301ResBody> {
  constructor(public telegram: TelegramService<FB000301ResBody>,
    public errorHandler: HandleErrorService,
    private _formateService: FormateService) {
    super(telegram, errorHandler, 'FB000301');
  }
  returnData;
  /**
  * 最新消息
  * @param page 頁次
  * @param sort 排序
  */
  getData(obj): Promise<any> {
    // 服務據點查詢
    const form = new FB000301ReqBody();
    form.nodeType = obj.nodeType;
    form.area = obj.area;
    form.searchText = obj.searchText;
    form.lon = obj.lon;
    form.lat = obj.lat;
    form.searchScope = obj.searchScope;
    form.paginator = obj.paginator;
    return this.send(form).then(
      (resObj) => {
        if (resObj.body['details'] != null) {
          this.returnData = this.modifyTransArray(resObj.body['details']['NodeData']);
        } else {
          this.returnData = null;
        }
        return Promise.resolve(this.returnData);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );




  }
}
