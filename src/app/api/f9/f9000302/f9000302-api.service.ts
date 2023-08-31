// F9000302:約定轉出帳號及待繳明細查詢
import { Injectable } from '@angular/core';
import { F9000302ResBody } from './f9000302-res';
import { F9000302ReqBody } from './f9000302-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F9000302ApiService extends ApiBase<F9000302ReqBody, F9000302ResBody> {

    constructor(
        public telegram: TelegramService<F9000302ResBody>,
        public authService: AuthService,
        public errorHandler: HandleErrorService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F9000302');

    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F9000302ReqBody = new F9000302ReqBody();


        // data.custId = this.authService.userInfo['custId']; // user info
        data.custId = userData.custId; // user info;
        data.borrowAccount = this._formateService.checkField(req, 'borrowAccount');
        if (data.borrowAccount == '') {
            this._logger.error('DATA_FORMAT_ERROR api req', data, req);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }


        return this.send(data).then(

            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    data: [],
                    page_info: {},
                    totalPages: 1,
                    accounts:[] //轉出帳號
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

                output.info_data = jsonObj;

                if (jsonObj.hasOwnProperty('details') && jsonObj['details']
                    && jsonObj['details'].hasOwnProperty('detail')
                    && jsonObj.details['detail']
                ) {
                    output.data = this.modifyTransArray(jsonObj.details['detail']);
                    output.info_data['details']['detail'] = this.modifyTransArray(jsonObj.details['detail']);
                }
                if(jsonObj.hasOwnProperty('accounts') && jsonObj['accounts']
                && jsonObj['accounts'].hasOwnProperty('account')
                && jsonObj.accounts['account']){
                    output.accounts=this.modifyTransArray(jsonObj.accounts['account']);
                }
                if (output.data.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY'
                    });
                }

                output.status = true;
                output.msg = '';

                output.page_info = this.pagecounter(jsonObj);
                output.totalPages = output.page_info['totalPages'];

                return Promise.resolve(output);
            },
            (errorObj) => {

                return Promise.reject(errorObj);
            }
        );
    }
}
