import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FO000103ReqBody } from './fo000103-req';
import { FO000103ResBody } from './fo000103-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FO000103ApiService extends ApiBase<FO000103ReqBody, FO000103ResBody> {

  constructor(
    public _authService: AuthService,
    private _formateService: FormateService,
    public telegram: TelegramService<FO000103ResBody>,
    public errorHandler: HandleErrorService) {
      super(telegram, errorHandler, 'FO000103');
    }

  send(data: FO000103ReqBody): Promise<any> {

    return super.send(data).then(
      (fo000103res) => {
        let output = {
          info_data: {},
          numLimit: '',
          saleList: [],
          takeNum: {},
          updateTime: ''
        };

        let jsonObj = (fo000103res.hasOwnProperty('body')) ? fo000103res['body'] : {};
        let jsonHeader = (fo000103res.hasOwnProperty('header')) ? fo000103res['header'] : {};

        output.info_data = this._formateService.transClone(jsonObj);
        if (jsonHeader.hasOwnProperty('responseTime')) {
          output.updateTime = this._formateService.transDate(jsonHeader.responseTime);
        }

        if (data.type == '0') {
          // === 取得分行清單 === //
          output.numLimit = jsonObj.numLimit;
          delete output.info_data['numLimit'];
          // 分行整理
          let check_sale = this.checkObjectList(jsonObj, 'saleList.sale');
          if (typeof check_sale !== 'undefined') {
              output.saleList = this.modifyTransArray(check_sale);
              delete output.info_data['saleList'];
          }
        } else {
          // === 取號 === //
          output.takeNum = jsonObj.takeNum;
          delete output.info_data['takeNum'];
        }

        return Promise.resolve(output);
      },
      (fo000103err) => {
        return Promise.reject(fo000103err);
      }
    );
  }

}
