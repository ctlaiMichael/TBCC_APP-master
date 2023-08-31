import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FO000104ReqBody } from './fo000104-req';
import { FO000104ResBody } from './fo000104-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FO000104ApiService extends ApiBase<FO000104ReqBody, FO000104ResBody> {

  constructor(
    public _authService: AuthService,
    private _formateService: FormateService,
    public telegram: TelegramService<FO000104ResBody>,
    public errorHandler: HandleErrorService) {
      super(telegram, errorHandler, 'FO000104');
    }

  send(data: FO000104ReqBody): Promise<any> {

    return super.send(data).then(
      (fo000104res) => {
        let output = {
          info_data: {},
          branches: [],
          updateTime: ''
        };

        let jsonObj = (fo000104res.hasOwnProperty('body')) ? fo000104res['body'] : {};
        let jsonHeader = (fo000104res.hasOwnProperty('header')) ? fo000104res['header'] : {};

        output.info_data = this._formateService.transClone(jsonObj);
        if (jsonHeader.hasOwnProperty('responseTime')) {
          output.updateTime = this._formateService.transDate(jsonHeader.responseTime);
        }

        // 取號分行列表整理
        if (typeof this.checkObjectList(this._formateService.transClone(jsonObj), 'branches.branch') !== 'undefined') {
          output.branches = this.modifyTransArray(this._formateService.transClone(jsonObj.branches.branch));

           // 取票紀錄整理
          output.branches.forEach((item, index) => {
            output.branches[index].numRecords = this.modifyTransArray(this._formateService.transClone(item.numRecords.record));
          });
        }

        if (jsonObj.rtnCode === '0000') {
          return Promise.resolve(output);
        } else {
          return Promise.reject(output);
        }
      },
      (fo000104err) => {
        return Promise.reject(fo000104err);
      }
    );
  }

}
