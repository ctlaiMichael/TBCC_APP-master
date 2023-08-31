import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000403ResBody } from './fI000403-res';
import { FI000403ReqBody } from './fI000403-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';


@Injectable()
export class FI000403ApiService extends ApiBase<FI000403ReqBody, FI000403ResBody> {
  constructor(
    public telegram: TelegramService<FI000403ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000403');
  }


  /**
   * 基金單筆申購申請
   * req
   *
   *
   *
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
    const data = new FI000403ReqBody();
    data.custId = userData.custId; // user info;
    data.trustAcnt = req.trustAcnt;
    data.fundCode = req.fundCode;
    data.currType = req.currType;
    data.amount = req.amount;
    data.payAcnt = req.payAcnt;
    data.salesId = req.salesId;
    data.salesName = req.salesName;
    data.introId = req.introId;
    data.introName = req.introName;
    data.notiCD = req.notiCD;
    data.sLossCD = req.sLossCD;
    data.sLoss = req.sLoss;
    data.sProCD = req.sProCD;
    data.sPro = req.sPro;
    this._logger.step('FUND', 'data.custId: ', data.custId);

    let output = {
        status: false,
        msg: 'Error',
        info_data: {},
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
        output.info_data['totalAmnt'] = this._formateService.checkField(output.info_data, 'totalAmnt');
        output.info_data['salesId'] = this._formateService.checkField(output.info_data, 'salesId');
        output.info_data['salesName'] = this._formateService.checkField(output.info_data, 'salesName');
        output.info_data['introId'] = this._formateService.checkField(output.info_data, 'introId');
        output.info_data['introName'] = this._formateService.checkField(output.info_data, 'introName');
        output.info_data['notiCD'] = this._formateService.checkField(output.info_data, 'notiCD'); //新增欄位
        output.info_data['sLossCD'] = this._formateService.checkField(output.info_data, 'sLossCD'); //新增欄位
        output.info_data['sLoss'] = this._formateService.checkField(output.info_data, 'sLoss'); //新增欄位
        output.info_data['sProCD'] = this._formateService.checkField(output.info_data, 'sProCD'); //新增欄位
        output.info_data['sPro'] = this._formateService.checkField(output.info_data, 'sPro'); //新增欄位

        if (
          output.info_data['fundCode'] == '' ||
          output.info_data['fundName'] == '' ||
          output.info_data['enrollDate'] == '' ||
          output.info_data['effectDate'] == '' ||
          output.info_data['totalAmnt'] == ''
        ) {
          return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.RSP_FORMATE_ERROR'
          });
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

}
