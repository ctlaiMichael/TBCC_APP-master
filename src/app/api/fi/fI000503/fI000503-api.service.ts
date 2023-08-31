import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000503ResBody } from './fI000503-res';
import { FI000503ReqBody } from './fI000503-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000503ApiService extends ApiBase<FI000503ReqBody, FI000503ResBody> {
  constructor(
    public telegram: TelegramService<FI000503ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000503');
  }


  /**
   * 基金贖回申請
   * req
   */
  getData(req: any): Promise<any> {
    const userData = this.authService.getUserInfo();
    this._logger.step('FUND', 'custId:', userData.hasOwnProperty('custId'));
    this._logger.step('FUND', 'custId1:', userData.custId);

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      this._logger.step('FUND', 'userData undefined');
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    const data = new FI000503ReqBody();
    data.custId = userData.custId; // user info;
    data.trustAcnt = req.trustAcnt;
    data.transCode = req.transCode;
    data.fundCode = req.fundCode;
    data.investType = req.investType;
    data.inCurrency = req.inCurrency;
    data.amount = req.amount;
    data.unit = req.unit;
    data.redeemAmnt = req.redeemAmnt;
    data.redeemAcnt = req.redeemAcnt;
    data.redeemType = req.redeemType;
    data.isContinue = req.isContinue;
    this._logger.step('FUND', 'data: ', data);

    let output = {
      status: false,
      msg: 'Error',
      info_data: {}
    };

    return super.send(data).then(
      (resObj) => {

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.step('FUND', 'line 67 api, jsonObj: ', jsonObj);
        output.info_data = jsonObj;
        output.info_data['fundCode'] = this._formateService.checkField(output.info_data, 'fundCode');
        output.info_data['fundName'] = this._formateService.checkField(output.info_data, 'fundName');
        output.info_data['enrollDate'] = this._formateService.checkField(output.info_data, 'enrollDate');
        output.info_data['effectDate'] = this._formateService.checkField(output.info_data, 'effectDate');
        output.info_data['remainAmnt'] = this._formateService.checkField(output.info_data, 'remainAmnt');

        if (
          output.info_data['fundCode'] == '' ||
          output.info_data['fundName'] == '' ||
          output.info_data['enrollDate'] == '' ||
          output.info_data['effectDate'] == '' ||
          output.info_data['remainAmnt'] == ''
        ) {
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.RSP_FORMATE_ERROR'
          });
        } else {
          output.status = true;
        }
        output.msg = '';
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}
