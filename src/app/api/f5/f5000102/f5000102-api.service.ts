// 外幣匯率查詢
import { Injectable } from '@angular/core';
import { F5000102ResBody } from './f5000102-res';
import { F5000102ReqBody } from './f5000102-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Injectable()
export class F5000102ApiService extends ApiBase<F5000102ReqBody, F5000102ResBody> {
    constructor(
        public telegram: TelegramService<F5000102ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000102');

    }

    /**
     *
     * @param type 外匯轉帳類別
     */
    getData(req): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        req.custId = userData.custId; // user info;
        req.trnsfrOutCurr = this._formateService.checkField(req, 'trnsfrOutCurr');
        req.trnsfrOutAmount = this._formateService.checkField(req, 'trnsfrOutAmount');
        req.trnsfrInCurr = this._formateService.checkField(req, 'trnsfrInCurr');
        req.trnsfrInAmount = this._formateService.checkField(req, 'trnsfrInAmount');
        req.openNightChk = this._formateService.checkField(req, 'openNightChk');
        // req.trnsfrInAmount = AmountUtil.currencyAmount(req.trnsfrInAmount)
        // req.trnsfrOutAmount = AmountUtil.currencyAmount(req.trnsfrOutAmount)
        req.trnsfrInAmount = req.trnsfrInAmount;
        req.trnsfrOutAmount = req.trnsfrOutAmount;

        return this.send(req).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

                output.info_data = jsonObj;

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
