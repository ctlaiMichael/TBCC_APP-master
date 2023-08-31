import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FO000102ReqBody } from './fo000102-req';
import { FO000102ResBody } from './fo000102-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class FO000102ApiService extends ApiBase<FO000102ReqBody, FO000102ResBody> {

  constructor(
    public _authService: AuthService,
    private _formateService: FormateService,
    public telegram: TelegramService<FO000102ResBody>,
    public errorHandler: HandleErrorService) {
      super(telegram, errorHandler, 'FO000102');
    }

  send(data: FO000102ReqBody): Promise<any> {

    return super.send(data).then(
      (fo000102res) => {
        let output = {
          info_data: {},
          branches: {},
        };

        let jsonObj = (fo000102res.hasOwnProperty('body')) ? fo000102res['body'] : {};
        let jsonHeader = (fo000102res.hasOwnProperty('header')) ? fo000102res['header'] : {};

        output.info_data = this._formateService.transClone(jsonObj);

        // 分行整理
        let check_branch = this.checkObjectList(jsonObj, 'branches.branch');
        if (typeof check_branch !== 'undefined') {
            output.branches = this.modifyTransArray(check_branch);
            delete output.info_data['branches'];
        }

        return Promise.resolve(output);
      },
      (fo000102err) => {
        return Promise.reject(fo000102err);
      }
    );
  }

}
