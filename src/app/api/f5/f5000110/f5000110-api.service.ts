// F5000110:-外幣議價確認
import { Injectable } from '@angular/core';
import { F5000110ResBody } from './f5000110-res';
import { F5000110ReqBody } from './f5000110-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Injectable()
export class F5000110ApiService extends ApiBase<F5000110ReqBody, F5000110ResBody> {
    constructor(
        public telegram: TelegramService<F5000110ResBody>,
        public authService: AuthService,
        public errorHandler: HandleErrorService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000110');

    }

    getData(req: object): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000110ReqBody = new F5000110ReqBody();
        data.custId = userData.custId; 
        data.fnctType = this._formateService.checkField(req, 'fnctType');//
        data.negotiatedBranch = this._formateService.checkField(req, 'negotiatedBranch');
        data.negotiatedNo=this._formateService.checkField(req, 'negotiatedNo');
        data.negotiatedCurr=this._formateService.checkField(req, 'negotiatedCurr');
        data.negotiatedRate= Number.parseFloat(this._formateService.checkField(req, 'negotiatedRate')).toFixed(4).toString();
        data.recordDate=this._formateService.checkField(req, 'recordDate');
        data.effectiveDate =this._formateService.checkField(req, 'effectiveDate');
        data.availableAmount=this._formateService.checkField(req, 'availableAmount');
        data.trnsfrAmount=AmountUtil.amount(this._formateService.checkField(req, 'trnsfrAmount')).replace(/,/g,'');
        data.trnsfrCurr=this._formateService.checkField(req, 'trnsfrCurr');
       
        if (data.fnctType == '' || data.negotiatedBranch=='' || data.negotiatedNo=='' || data.negotiatedCurr==''
        || data.negotiatedRate=='' || data.recordDate==''  || data.effectiveDate==''
        || data.availableAmount==''|| data.trnsfrAmount==''|| data.trnsfrCurr=='') {
            this._logger.error('DATA_FORMAT_ERROR api req', data, req);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    trnsRsltCode: '',
                    hostCode: '',
                    hostCodeMsg: '',
                    title: 'ERROR.TITLE',
                    msg: 'ERROR.DEFAULT',
                    classType: 'error',
                    info_data: {},
                    requestTime: ''
                };


                const transRes = TransactionApiUtil.modifyResponse(resObj);
                let telegram = transRes.body;
                output.status = transRes.status;
                output.title = transRes.title;
                output.msg = transRes.msg;
                output.classType = transRes.classType;
                output.trnsRsltCode = transRes.trnsRsltCode;
                output.hostCode = transRes.hostCode;
                output.hostCodeMsg = transRes.hostCodeMsg;
                output.info_data = telegram;
                if (output.hostCode != '4001') {
                    return Promise.reject(output);
                }
                return Promise.resolve(output);
            },
            (errorObj) => {

                return Promise.reject(errorObj);
            }
        );
    }


}
