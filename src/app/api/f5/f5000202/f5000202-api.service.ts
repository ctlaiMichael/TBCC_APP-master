
/**
 * F5000202:
 * 繳交外幣保費
 */
import { Injectable } from '@angular/core';
import { F5000202ResBody } from './f5000202-res';
import { F5000202ReqBody } from './f5000202-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { TelegramOption } from '@core/telegram/telegram-option';

@Injectable()
export class F5000202ApiService extends ApiBase<F5000202ReqBody, F5000202ResBody> {
    constructor(
        public telegram: TelegramService<F5000202ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000202');

    }

    /**
     *
     * @param
     */
    getData(req: any, security: any): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 檢查安控
        // let reqHeader = new TelegramOption();
        // if (typeof security !== 'undefined' && security) {
        //     reqHeader.header = security;
        // } else {
        //     return Promise.reject({
        //         title: 'ERROR.TITLE',
        //         content: 'ERROR.DATA_FORMAT_ERROR'
        //     });
        // }
        // 參數處理
        let data: F5000202ReqBody = new F5000202ReqBody();

        data.custId = userData.custId; // user info;
        data.paymentObject = req.paymentObject;
        data.trnsfrOutAcct = req.trnsfrOutAcct;
        data.trnsfrOutCurr = req.trnsfrOutCurr;
        data.trnsfrAmount = req.trnsfrAmount;
        data.paymentNumber = req.paymentNumber;
        data.trnsToken = req.trnsToken;
        // const option = this.modifySecurityOption(reqHeader);

        let output = {
            status: false,
            title: 'ERROR.TITLE',
            msg: 'ERROR.DEFAULT',
            trnsRsltCode: '',
            hostCode: '',
            hostCodeMsg: '',
            classType: 'error',
            info_data: {},
        };

        return this.send(data,security).then(
            (resObj) => {
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

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
                output.info_data['trnsRsltCode'] = output.trnsRsltCode;
                output.info_data['hostCode'] = output.hostCode;
                output.info_data['hostCodeMsg'] = output.hostCodeMsg;

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
