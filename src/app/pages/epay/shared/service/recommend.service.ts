/**
 * 推薦人設定與查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { FQ000108ApiService } from '@api/fq/fq000108/fq000108-api.service';
import { FQ000109ApiService } from '@api/fq/fq000109/fq000109-api.service';

@Injectable()
export class RecommendService {
  constructor(
    private _logger: Logger,
    private _formateService: FormateService,
    private _checkService: CheckService,
    private fq000108: FQ000108ApiService, // 設定
    private fq000109: FQ000109ApiService // 查詢
  ) { }

  /**
   * 推薦人查詢
   */
  getData(): Promise<any> {
    let form: any = {};
    return this.fq000109.send(form).then(
      (resfq000109) => {
        return Promise.resolve(resfq000109);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

  /**
   * 推薦人設定
   * 推薦人編號部可為空，且僅可為英數字
   */
  saveData(obj): Promise<any> {
    let employNo = this._formateService.checkField(obj, 'employNo');
    if (!this._checkService.checkEmpty(employNo, true)) {
      return Promise.reject({
        title: 'ERROR.TITLE',
        msg: 'EPAY.RECOMMEND.FIELD.ID_EDIT', // // 請輸入推薦人編號(共6碼)
        type: 'dialog'
      });
    }
    let check_data = this._checkService.checkEnglish(employNo, 'english_number');
    if (!check_data.status) {
      return Promise.reject({
        title: 'ERROR.TITLE',
        msg: check_data.msg,
        type: 'dialog'
      });
    }


    // 更新推薦人編號
    let formObj: any = {};
    formObj.employNo = employNo;
    return this.fq000108.send(formObj).then(
      (resObj) => {
        // 直接顯示結果
        return Promise.resolve(resObj);
      },
      (errorfq000108) => {
        return Promise.reject(errorfq000108);
      }
    );

  }

}
