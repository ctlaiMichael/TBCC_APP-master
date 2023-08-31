// 
/**
 * 台外幣預約轉帳
 * 約定即時轉帳
 */
import { Injectable } from '@angular/core';
import { F5000105ResBody } from './f5000105-res';
import { F5000105ReqBody } from './f5000105-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F5000105ApiService extends ApiBase<F5000105ReqBody, F5000105ResBody> {
    constructor(
        public telegram: TelegramService<F5000105ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000105');
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
        let data: F5000105ReqBody = new F5000105ReqBody();
        // let tmp_trnsfrDate = this._formateService.checkField(req, 'trnsfrDate');

        data.custId = userData.custId; // user info;
        data.trnsfrDate = this._formateService.checkField(req, 'trnsfrDate');
        data.trnsfrOutAccnt = this._formateService.checkField(req, 'trnsfrOutAccnt');
        data.trnsfrOutCurr = this._formateService.checkField(req, 'trnsfrOutCurr');
        data.trnsfrInAccnt = this._formateService.checkField(req, 'trnsfrInAccnt');
        data.trnsInSetType = this._formateService.checkField(req, 'trnsInSetType');
        data.trnsfrInCurr = this._formateService.checkField(req, 'trnsfrInCurr');
        data.trnsfrAmount = this._formateService.checkField(req, 'trnsfrAmount');
        data.trnsfrCurr = this._formateService.checkField(req, 'trnsfrCurr');
        data.subType = this._formateService.checkField(req, 'subType');
        data.subTypeDscp = this._formateService.checkField(req, 'subTypeDscp');
        data.note = this._formateService.checkField(req, 'note');
        data.trnsToken = this._formateService.checkField(req, 'trnsToken');
        // 民國年, yyyMMdd
        data.trnsfrDate = this._formateService.transDate(data.trnsfrDate, { formate: 'yyyMMdd', chinaYear: true });

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
                if (resObj.hasOwnProperty('result') && resObj.result != '0') {
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
