
/**
 * F5000111議價匯率結果電文
 */
import { Injectable } from '@angular/core';
import { F5000111ResBody } from './f5000111-res';
import { F5000111ReqBody } from './f5000111-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { TelegramOption } from '@core/telegram/telegram-option';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Injectable()
export class F5000111ApiService extends ApiBase<F5000111ReqBody, F5000111ResBody> {
    constructor(
        public telegram: TelegramService<F5000111ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000111');

    }

    /**
     *
     * @param
     */
    getData(req: object, security: any): Promise<any> {
        //檢查使用者id
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 檢查安控
        let reqHeader = new TelegramOption();
        if (typeof security !== 'undefined' && security) {
            reqHeader.header = security;
        } else {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000111ReqBody = new F5000111ReqBody();

        data.custId = userData.custId; // user info;
        data.trnsfrOutAccnt = this._formateService.checkField(req, 'trnsfrOutAccnt');
        data.trnsfrOutCurr = this._formateService.checkField(req, 'trnsfrOutCurr');
        data.trnsfrOutAmount =  AmountUtil.amount(this._formateService.checkField(req, 'trnsfrOutAmount')).replace(/,/g,'');
        data.trnsfrInAccnt = this._formateService.checkField(req, 'trnsfrInAccnt');
        data.trnsInSetType = this._formateService.checkField(req, 'trnsInSetType');
        data.trnsfrInCurr = this._formateService.checkField(req, 'trnsfrInCurr');
        data.trnsfrInAmount = AmountUtil.amount(this._formateService.checkField(req, 'trnsfrInAmount')).replace(/,/g,'');
        data.subType = this._formateService.checkField(req, 'subType');
        data.trnsfrRate = Number.parseFloat(this._formateService.checkField(req, 'negotiatedRate')).toFixed(4).toString();//即議價匯率
        data.trnsfrCurr = this._formateService.checkField(req, 'trnsfrCurr');//轉入幣別
        data.note = this._formateService.checkField(req, 'note');
        data.negotiatedBranch = this._formateService.checkField(req, 'negotiatedBranch');
        data.negotiatedNo = this._formateService.checkField(req, 'negotiatedNo');
        data.negotiatedCurr = this._formateService.checkField(req, 'negotiatedRate');
        data.trnsToken = this._formateService.checkField(req, 'trnsToken');
   
        if (data.trnsfrOutAccnt == ''
            || data.trnsfrOutCurr == ''
            || data.trnsfrInAccnt == ''
            || data.trnsfrInCurr == ''
            || data.trnsfrRate == ''
            || data.trnsfrCurr == ''
            || data.negotiatedBranch == ''
            || data.negotiatedNo == ''
            || data.negotiatedCurr == ''
            || data.trnsToken == ''
        ) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return this.send(data, security).then(
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
                if (output.trnsRsltCode != '0') {
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
