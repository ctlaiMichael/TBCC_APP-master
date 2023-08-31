import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { FI000709ResBody } from './fI000709-res';
import { FI000709ReqBody } from './fI000709-req';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { logger } from '@shared/util/log-util';


@Injectable()
export class FI000709ApiService extends ApiBase<FI000709ReqBody, FI000709ResBody> {
  constructor(
    public telegram: TelegramService<FI000709ResBody>,
    public errorHandler: HandleErrorService,
    public authService: AuthService,
    private _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'FI000709');
  }


  /**
   * 基金小額申購申請-新基金主機
   * req
   */
  getData(req: any): Promise<any> {
    const userData = this.authService.getUserInfo();

    if (!userData.hasOwnProperty('custId') || userData.custId === '') {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    let data = new FI000709ReqBody();
    // 塞api request
    data.custId = userData.custId; // user info;
    data.trustAcnt = req.trustAcnt;
    data.fundCode = req.fundCode;
    data.enrollDate = req.enrollDate;
    data.amount = req.amount;
    data.payAcnt = req.payAcnt;
    data.fundType = req.fundType;
    data.salesId = req.salesId;
    data.salesName = req.salesName;
    data.introId = req.introId;
    data.introName = req.introName;
    data.code = req.code;
    data.payDate31 = req.payDate31;
    data.payDate5W = req.payDate5W;
    data.notiCD = req.notiCD;
    data.sLossCD = req.sLossCD;
    data.sLoss = req.sLoss;
    data.sProCD = req.sProCD;
    data.sPro = req.sPro;
    data.continue = req.continue;
    data.decline1Cd = req.decline1Cd;
    data.decline1 = req.decline1;
    data.decline2Cd = req.decline2Cd;
    data.decline2 = req.decline2;
    data.decline3Cd = req.decline3Cd;
    data.decline3 = req.decline3;
    data.decline4Cd = req.decline4Cd;
    data.decline4 = req.decline4;
    data.decline5Cd = req.decline5Cd;
    data.decline5 = req.decline5;
    data.gain1Cd = req.gain1Cd;
    data.gain1 = req.gain1;
    data.gain2Cd = req.gain2Cd;
    data.gain2 = req.gain2;
    data.gain3Cd = req.gain3Cd;
    data.gain3 = req.gain3;
    data.gain4Cd = req.gain4Cd;
    data.gain4 = req.gain4;
    data.gain5Cd = req.gain5Cd;
    data.gain5 = req.gain5;

    let output = {
      status: false,
      msg: 'Error',
      info_data: {}
    };
  
    logger.error('FUND', 'line 93 data:', data);
    return super.send(data).then(
      (resObj) => {

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.step('FUND', 'line 67 api, jsonObj: ', jsonObj);
        output.info_data = jsonObj;
        output.info_data['fundCode'] = this._formateService.checkField(output.info_data, 'fundCode');
        output.info_data['fundName'] = this._formateService.checkField(output.info_data, 'fundName');
        output.info_data['fundRisk'] = this._formateService.checkField(output.info_data, 'fundRisk');
        output.info_data['enrollDate'] = this._formateService.checkField(output.info_data, 'enrollDate');
        output.info_data['effectDate'] = this._formateService.checkField(output.info_data, 'effectDate');
        output.info_data['amount'] = this._formateService.checkField(output.info_data, 'amount');
        // 無輸入中台會回null,需判斷轉為字串
        output.info_data['codeDesc'] = this._formateService.checkField(output.info_data, 'codeDesc');
        output.info_data['payDate31'] = this._formateService.checkField(output.info_data, 'payDate31');
        output.info_data['payDate5W'] = this._formateService.checkField(output.info_data, 'payDate5W');
        output.info_data['sProCD'] = this._formateService.checkField(output.info_data, 'sProCD');
        output.info_data['sPro'] = this._formateService.checkField(output.info_data, 'sPro');
        output.info_data['sLoss'] = this._formateService.checkField(output.info_data, 'sLoss');
        output.info_data['notiCD'] = this._formateService.checkField(output.info_data, 'notiCD');
        output.info_data['continue'] = this._formateService.checkField(output.info_data, 'continue');
        output.info_data['trustAcnt'] = this._formateService.checkField(output.info_data, 'trustAcnt');
        output.info_data['code'] = this._formateService.checkField(output.info_data, 'code');
        // 設定停損停利值，使用者有可能不輸入值，中台709 req會回null，需判斷
        output.info_data['decline1Cd'] = this._formateService.checkField(output.info_data, 'decline1Cd');
        output.info_data['decline1'] = this._formateService.checkField(output.info_data, 'decline1');
        output.info_data['decline2Cd'] = this._formateService.checkField(output.info_data, 'decline2Cd');
        output.info_data['decline2'] = this._formateService.checkField(output.info_data, 'decline2');
        output.info_data['decline3Cd'] = this._formateService.checkField(output.info_data, 'decline3Cd');
        output.info_data['decline3'] = this._formateService.checkField(output.info_data, 'decline3');
        output.info_data['decline4Cd'] = this._formateService.checkField(output.info_data, 'decline4Cd');
        output.info_data['decline4'] = this._formateService.checkField(output.info_data, 'decline4');
        output.info_data['decline5Cd'] = this._formateService.checkField(output.info_data, 'decline5Cd');
        output.info_data['decline5'] = this._formateService.checkField(output.info_data, 'decline5');
        output.info_data['gain1Cd'] = this._formateService.checkField(output.info_data, 'gain1Cd');
        output.info_data['gain1'] = this._formateService.checkField(output.info_data, 'gain1');
        output.info_data['gain2Cd'] = this._formateService.checkField(output.info_data, 'gain2Cd');
        output.info_data['gain2'] = this._formateService.checkField(output.info_data, 'gain2');
        output.info_data['gain3Cd'] = this._formateService.checkField(output.info_data, 'gain3Cd');
        output.info_data['gain3'] = this._formateService.checkField(output.info_data, 'gain3');
        output.info_data['gain4Cd'] = this._formateService.checkField(output.info_data, 'gain4Cd');
        output.info_data['gain4'] = this._formateService.checkField(output.info_data, 'gain4');
        output.info_data['gain5Cd'] = this._formateService.checkField(output.info_data, 'gain5Cd');
        output.info_data['gain5'] = this._formateService.checkField(output.info_data, 'gain5');
        //理財、銷售員不輸入，中台可能回null
        output.info_data['salesId'] = this._formateService.checkField(output.info_data, 'salesId');
        output.info_data['salesName'] = this._formateService.checkField(output.info_data, 'salesName');
        output.info_data['introId'] = this._formateService.checkField(output.info_data, 'introId');
        output.info_data['introName'] = this._formateService.checkField(output.info_data, 'introName');

        logger.error('FUND', 'line 132 api 709 output:', output);
        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
      },
      (errorObj) => {
        logger.error('api service 134', errorObj);
        return Promise.reject(errorObj);
      }
    );
  }

}
