/**
 * FB000502-最新消息內文
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FB000502ResBody } from './fb000502-res';
import { FB000502ReqBody } from './fb000502-req';
import { CheckService } from '@shared/check/check.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';


@Injectable()
export class FB000502ApiService extends ApiBase<FB000502ReqBody, FB000502ResBody> {
  constructor(
    public telegram: TelegramService<FB000502ResBody>
    , private _checkService: CheckService
    , private _formateService: FormateService,
    public errorHandler: HandleErrorService
  ) {
    super(telegram, errorHandler, 'FB000502');
  }

  /**
   * 取得資料
   * @param id 取得最新消息內文
   */
  getData(id: string): Promise<any> {
    let set_data = new FB000502ReqBody();
    if (!this._checkService.checkEmpty(id, true, false)) {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    set_data.newsNo = id;

    return this.send(set_data).then(
      (resObj) => {
        let output = {
          status: false,
          msg: '',
          data: {}
        };

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        output.data = this._modifyResponse(jsonObj);

        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

  /**
   * 資料整理
   * @param set_data api data
   * image 實際上已沒有此欄位
   * fileType 實際上已沒有此欄位
   */
  private _modifyResponse(set_data: object) {
    let output = {
      title: '',
      sub_title: '',
      dataTime: {
        apply: '',
        expire: ''
      }
    };
    // Title
    if (set_data.hasOwnProperty('newsSubject')) {
      output.title = set_data['newsSubject'];
    }
    // SubTitle
    if (set_data.hasOwnProperty('newsBody')) {
      output.sub_title = set_data['newsBody'];
    }
    // applyDateTime
    if (set_data.hasOwnProperty('applyDateTime') && this._checkService.checkEmpty(set_data['applyDateTime'], true, true)) {
      output.sub_title = this._formateService.transDate(set_data['applyDateTime']);
    }
    // expireDateTime
    if (set_data.hasOwnProperty('expireDateTime') && this._checkService.checkEmpty(set_data['applyDateTime'], true, true)) {
      output.sub_title = this._formateService.transDate(set_data['expireDateTime']);
    }
    return output;
  }

}
