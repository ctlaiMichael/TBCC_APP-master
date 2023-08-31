// 外匯綜活存轉綜定
import { Injectable } from '@angular/core';
import { F6000301ResBody } from './f6000301-res';
import { F6000301ReqBody } from './f6000301-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F6000301ApiService extends ApiBase<F6000301ReqBody, F6000301ResBody> {
    constructor(public telegram: TelegramService<F6000301ResBody>,
        public errorHandler: HandleErrorService,
        private authService: AuthService) {
        super(telegram, errorHandler, 'F6000301');
    }

    getData(data, reqHeader): Promise<any> {

        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId;
        let AmountInt = parseFloat(data.transfrAmount);
        if (data.trnsfrOutAccnt == '' ||
            data.trnsfrOutCurr == '' ||
            data.transfrTimes == '' ||
            data.autoTransCode == '' ||
            data.transfrAmount == '' || AmountInt <= 0 ||
            data.businessType == '' ||
            data.trnsToken == '' ||
            data.computeIntrstType == ''

        ) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.transfrAmount=data.transfrAmount.toString();

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

                let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
                if (telegramHeader.hasOwnProperty('requestTime')) {
                    output.requestTime = telegramHeader.requestTime ;
                }

                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );

    }
}
