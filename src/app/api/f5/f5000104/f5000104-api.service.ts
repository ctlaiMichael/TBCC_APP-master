
/**
 * F5000104:外幣約定
 * 即時轉帳
 */
import { Injectable } from '@angular/core';
import { F5000104ResBody } from './f5000104-res';
import { F5000104ReqBody } from './f5000104-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F5000104ApiService extends ApiBase<F5000104ReqBody, F5000104ResBody> {
    constructor(
        public telegram: TelegramService<F5000104ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000104');

    }

    /**
     *
     * @param
     */
    getData(req: object, reqHeader): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000104ReqBody = new F5000104ReqBody();

        data.custId = userData.custId; // user info;
        data.trnsfrOutAccnt = this._formateService.checkField(req, 'trnsfrOutAccnt');
        data.trnsfrOutCurr = this._formateService.checkField(req, 'trnsfrOutCurr');
        data.trnsfrOutAmount = this._formateService.checkField(req, 'trnsfrOutAmount');
        data.trnsfrInAccnt = this._formateService.checkField(req, 'trnsfrInAccnt');
        data.trnsfrInId = this._formateService.checkField(req, 'trnsfrInId');
        data.trnsfrInCurr = this._formateService.checkField(req, 'trnsfrInCurr');
        data.trnsfrInAmount = this._formateService.checkField(req, 'trnsfrInAmount');
        data.trnsfrOutRate = this._formateService.checkField(req, 'trnsfrOutRate');
        data.trnsfrInRate = this._formateService.checkField(req, 'trnsfrInRate');
        data.note = this._formateService.checkField(req, 'note');
        data.businessType = this._formateService.checkField(req, 'businessType');
        data.trnsToken = this._formateService.checkField(req, 'trnsToken');

        if (data.trnsfrOutAccnt == ''
            || data.trnsfrOutCurr == ''
            || data.trnsfrInAccnt == ''
            || data.trnsfrInCurr == ''
            || data.trnsfrOutRate == ''
            || data.trnsfrInRate == ''
            || data.businessType == ''
            || data.trnsToken == ''
        ) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return this.send(data, reqHeader).then(
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
                if(output.trnsRsltCode!='0'){
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
