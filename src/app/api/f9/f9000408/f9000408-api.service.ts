import { FormateService } from '@shared/formate/formate.service';
import { Injectable, Output } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { F9000408ReqBody } from './f9000408-req';
import { F9000408ResBody } from './f9000408-res';

@Injectable()
export class F9000408ApiService extends ApiBase<F9000408ReqBody, F9000408ResBody> {

  constructor(
    public telegram: TelegramService<F9000408ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    public _formateService: FormateService,
    private _logger: Logger
  ) {
    super(telegram, errorHandler, 'F9000408');

  }

  sendData(req: any, reqHeader?: any): Promise<any> {
    let data = new F9000408ReqBody();
    const custId = this.authService.getCustId();
    data.custId = custId;
    data.txNo = req.txNo;
    data.tvr = req.tvr;
    data.funcId = req.funcId;
    data.isId = req.isId;
    data.isFin = req.isFin;
    data.isWork = req.isWork;
    data.isHouse = req.isHouse;
    data.isOther = req.isOther;
    data.idCopy1 = req.idCopy1;
    data.idCopy2 = req.idCopy2;
    data.finProof1 = req.finProof1;
    data.workProof1 = req.workProof1;
    data.houseProof1 = req.houseProof1;
    data.otherProof1 = req.otherProof1;
    data.source = req.source;

    let output = {
      status: false,
      result: '', //成功0 失敗1
      respCode: '', //電文回應代碼
      respCodeMsg: '', //電文代碼說明
      info_data: {}
    };

    this._logger.log("data:", data);
    return super.send(data).then(
      (resObj) => {
        this._logger.log("resObj:", resObj);
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.log('jsonObj:', jsonObj);
        output.info_data = jsonObj;
        output.result = jsonObj.result;
        this._logger.log("jsonObj.result:", jsonObj.result);
        output.respCode = jsonObj.respCode;
        output.respCodeMsg = jsonObj.respCodeMsg;
        this._logger.log("api return output:", this._formateService.transClone(output));
        output.status = true;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}




