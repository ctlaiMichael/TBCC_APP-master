
/**
 * F5000107:
 * 外幣預約轉帳註銷
 */
import { Injectable } from '@angular/core';
import { F5000107ResBody } from './f5000107-res';
import { F5000107ReqBody } from './f5000107-req';
import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F5000107ApiService extends ApiBase<F5000107ReqBody, F5000107ResBody> {
    constructor(
        public telegram: TelegramService<F5000107ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000107');

    }

    /**
     *
     * @param
     */
    getData(req: object, reqHeader?): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000107ReqBody = new F5000107ReqBody();

        data.custId = userData.custId; // user info;

        data.trnsfrDate = this._formateService.checkField(req, 'trnsfrDate');
        data.trnsfrDate = this._formateService.transDate(data.trnsfrDate, { 'formate': 'yyyMMdd', 'chinaYear': true });

        // data.orderDate = this._formateService.checkField(req, 'orderDate');
        data.orderNo = this._formateService.checkField(req, 'orderNo');
        data.trnsToken = this._formateService.checkField(req, 'trnsToken');
        data.trnsfrOutAccnt = this._formateService.checkField(req, 'trnsfrOutAccnt');
        data.trnsfrInAccnt = this._formateService.checkField(req, 'trnsfrInAccnt');
        data.trnsfrCurr = this._formateService.checkField(req, 'trnsfrCurr');
        data.trnsfrAmount = this._formateService.checkField(req, 'trnsfrAmount');
        data.subType = this._formateService.checkField(req, 'subType');
        data.note = this._formateService.checkField(req, 'note');
        data.note = (typeof data.note === 'string' ? data.note : '');


        return this.send(data, reqHeader).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    // data: [],
                    requestTime: ''
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                output.info_data = jsonObj;
                let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
                output.requestTime = this._formateService.checkField(jsonHeader, 'responseTime');
                // 沒有hostCodeMsg
                if (jsonObj.hostCodeMsg === '') {
                    if (jsonObj.hostCode === '4001' && jsonObj.trnsRsltCode === '0') {
                        jsonObj.hostCodeMsg = '交易成功';
                    } else if (jsonObj.trnsRsltCode === '1') {
                        jsonObj.hostCodeMsg = '交易失敗';
                    } else if (jsonObj.trnsRsltCode === 'X') {

                        jsonObj.hostCodeMsg = '交易異常';
                    }
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
