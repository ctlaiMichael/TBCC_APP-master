import { Injectable } from '@angular/core';
import { F6000202ResBody } from './f6000202-res';
import { F6000202ReqBody } from './f6000202-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F6000202ApiService extends ApiBase<F6000202ReqBody, F6000202ResBody> {
    constructor(public telegram: TelegramService<F6000202ResBody>,
        public errorHandler: HandleErrorService,
        private authService: AuthService) {
        super(telegram, errorHandler, 'F6000202');
    }
    /**
     * F6000202-台幣綜定存中途解約
     */
    send(data: F6000202ReqBody, reqHeader): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId;

        if (data.fDAccount == ''|| data.balance == ''|| data.trnsToken == ''
        ) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return super.send(data, reqHeader).then(
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
                    leftBtnIcon:'menu'
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
