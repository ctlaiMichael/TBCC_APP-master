// F9000301:借款帳號歸戶查詢
import { Injectable } from '@angular/core';
import { F9000301ResBody } from './f9000301-res';
import { F9000301ReqBody } from './f9000301-req';

import { TelegramService } from '@core/telegram/telegram.service';
// import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F9000301ApiService extends ApiBase<F9000301ReqBody, F9000301ResBody> {

    constructor(
        public telegram: TelegramService<F9000301ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F9000301');

    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getPageData(page?: number, sort?: Array<any>): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F9000301ReqBody = new F9000301ReqBody();
        data.custId = userData.custId; // user info;


        return this.send(data).then(

            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    data: [],
                    page_info: {},
                    totalPages: 1

                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

                output.info_data = jsonObj;
                if (jsonObj.hasOwnProperty('details') &&  jsonObj['details']
                    && jsonObj['details'].hasOwnProperty('detail')
                    && jsonObj.details['detail']
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
