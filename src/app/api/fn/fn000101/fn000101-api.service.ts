import { Injectable } from '@angular/core';
import { ApiBase } from '@base/api/api-base.class';
import { FN000101ReqBody } from './fn000101-req';
import { FN000101ResBody } from './fn000101-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class FN000101ApiService extends ApiBase<FN000101ReqBody, FN000101ResBody> {

  constructor(
    public telegram: TelegramService<FN000101ResBody>,
    private _formateService: FormateService,
    private logger: Logger,
    public errorHandler: HandleErrorService) {
      super(telegram, errorHandler, 'FN000101');
    }

  send(data: FN000101ReqBody, security): Promise<any> {
    let reqHeader = new TelegramOption();
    if (typeof security !== 'undefined' && security) {
      reqHeader.header = security;
    } else {
        return Promise.reject({
            title: 'ERROR.TITLE',
            content: 'ERROR.DATA_FORMAT_ERROR'
        });
    }
    return super.send(data, reqHeader).then(
      (fn000101res) => {
        this.logger.debug('fn000101res:', fn000101res);
        let output = {
          dataTime: '',
          info_data: {},
          custId: '',
          data: [],
          recType: '',
          mailType: '',
        };

        let jsonObj = (fn000101res.hasOwnProperty('body')) ? fn000101res['body'] : {};
        let jsonHeader = (fn000101res.hasOwnProperty('header')) ? fn000101res['header'] : {};

        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);
        output.custId = jsonHeader.custId;
        output.recType = jsonObj.recType;
        output.mailType = jsonObj.mailType;


        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
        }

        if (output.info_data.hasOwnProperty('respCode') && !!output.info_data['respCode']) {
          return Promise.reject(output);
        } else {
          return Promise.resolve(output);
        }
      },
      (fn000101err) => {
        this.logger.debug('fn000101err:', fn000101err);
        let jsonObj = (fn000101err.resultData.hasOwnProperty('body')) ? fn000101err.resultData['body'] : {};
        let jsonHeader = (fn000101err.resultData.hasOwnProperty('header')) ? fn000101err.resultData['header'] : {};
        let output = {
          dataTime: this._formateService.checkField(jsonHeader, 'responseTime'),
          info_data: this._formateService.transClone(jsonObj),
          custId: jsonHeader.custId,
          data: [],
        };
        return Promise.reject(output);
      }
    );
  }

}
