
/**
 * F5000201:
 * 外幣保費資料查詢
 */
import { Injectable } from '@angular/core';
import { F5000201ResBody } from './f5000201-res';
import { F5000201ReqBody } from './f5000201-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';

@Injectable()
export class F5000201ApiService extends ApiBase<F5000201ReqBody, F5000201ResBody> {
    constructor(
        public telegram: TelegramService<F5000201ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000201');

    }

    /**
     *
     * @param
     */
    getData(req: string): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000201ReqBody = new F5000201ReqBody();

        data.custId = userData.custId; // user info;

        let output = {
            status: false,
            title: 'ERROR.TITLE',
            msg: 'ERROR.DEFAULT',
            trnsRsltCode: '',
            hostCode: '',
            hostCodeMsg: '',
            classType: 'error',
            info_data: {},
            data: [], //列表
            not_handle: true
        };

        return this.send(data).then(
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

                if (jsonObj.hasOwnProperty('trnsOutAccts') && jsonObj['trnsOutAccts']
                    && typeof jsonObj['trnsOutAccts'] === 'object' && jsonObj['trnsOutAccts'].hasOwnProperty('trnsOutAcct')) {
                    output['data'] = this.modifyTransArray(jsonObj['trnsOutAccts']['trnsOutAcct']);
                }

                if ((!jsonObj.hasOwnProperty('trnsOutAccts') || typeof jsonObj['trnsOutAccts'] === 'undefined')
                    && jsonObj['trnsRsltCode'] == '1') {
                    output['not_handle'] = false;
                }

                if (jsonObj['trnsRsltCode'] != '0') {
                    output.msg = jsonObj['hostCodeMsg'];
                    return Promise.reject(output);
                }
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
