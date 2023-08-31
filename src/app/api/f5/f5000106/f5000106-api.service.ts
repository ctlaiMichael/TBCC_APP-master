/**
 * 外幣活存預約轉帳查詢
 */
import { Injectable } from '@angular/core';
import { F5000106ResBody } from './f5000106-res';
import { F5000106ReqBody } from './f5000106-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F5000106ApiService extends ApiBase<F5000106ReqBody, F5000106ResBody> {
    // userInfo:string;
    constructor(
        public telegram: TelegramService<F5000106ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000106');

    }


    replaceDash(str) {
        let replaceString = '';
        replaceString = str.replace(/-/g, '');
        return replaceString;
    }

    /**
     *
     * @param
     */
    getData(req: object): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000106ReqBody = new F5000106ReqBody();

        data.custId = userData.custId; // user info;
        data.exchangeType = this._formateService.checkField(req, 'exchangeType');
        data.startDate = this._formateService.checkField(req, 'startDate');
        data.startDate = this._formateService.transDate(this.replaceDash(data.startDate), { 'formate': 'yyyMMdd', 'chinaYear': true });
        data.endDate = this._formateService.checkField(req, 'endDate');
        data.endDate = this._formateService.transDate(this.replaceDash(data.endDate), { 'formate': 'yyyMMdd', 'chinaYear': true });
        data.trnsfrOutAccnt = this._formateService.checkField(req, 'trnsfrOutAccnt');



        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    data: [],
                    requestTime: ''
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
                output.requestTime = this._formateService.checkField(jsonHeader, 'responseTime');
                output.info_data = jsonObj;

                if (jsonObj.hasOwnProperty('details') && jsonObj['details']
                    && jsonObj['details'].hasOwnProperty('detail')
                    && jsonObj['details']['detail']
                ) {
                    output.data = this.modifyTransArray(jsonObj.details['detail']);
                }

                if (output.data.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY'
                    });
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
