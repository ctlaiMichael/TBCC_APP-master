// F9000201:借款明細查詢
import { Injectable } from '@angular/core';
import { F9000201ResBody } from './f9000201-res';
import { F9000201ReqBody } from './f9000201-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F9000201ApiService extends ApiBase<F9000201ReqBody, F9000201ResBody> {
    constructor(
        public telegram: TelegramService<F9000201ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F9000201');

    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
  getData(req: object, page?: number, sort?: Array<any>, pageSize?: string | number): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty("custId") || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F9000201ReqBody = new F9000201ReqBody();
        data.paginator = this.modifyPageReq(data.paginator, page, sort);
    if (pageSize) {
      data.paginator.pageSize = pageSize;
    }
        data.custId = userData.custId; // user info;
        data.account = this._formateService.checkField(req, 'account');
        data.startDate = this._formateService.checkField(req, 'startDate');
        data.endDate = this._formateService.checkField(req, 'endDate');
        if (data.account == '' || data.startDate == '' || data.endDate == '') {
            this._logger.error('DATA_FORMAT_ERROR api req', data, req);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }

        // 民國年, yyyMMdd
        data.startDate = this._formateService.transDate(data.startDate, { formate: 'yyyMMdd', chinaYear: true });
        data.endDate = this._formateService.transDate(data.endDate, { formate: 'yyyMMdd', chinaYear: true });

        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    data: [],
                    page_info: {},
                    totalPages: 1,
                    dataTime: '',
                    summary_data: {}
                };
                let modify_data = this._modifyRespose(resObj);
                output.dataTime = modify_data.dataTime;
                output.info_data = modify_data.info_data;
                output.data = modify_data.data;
                output.page_info = modify_data.page_info;
                output.totalPages = output.page_info['totalPages'];

                // 需顯示借款資料
                if (output.data.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY_SEARCH', // 查詢期間無交易資料
                        data: output,
                        dataTime: output.dataTime
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
    /**
     * Response整理
     * @param jsonObj 資料判斷
     */
    private _modifyRespose(resObj) {
        let output = {
            dataTime: '',
            info_data: {},
            data: [],
            page_info: {},
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);
        if (jsonObj.hasOwnProperty('details') && jsonObj['details']
            && jsonObj['details'].hasOwnProperty('detail')
            && jsonObj['details']['detail']
        ) {
            output.data = this.modifyTransArray(jsonObj['details']['detail']);
            delete output.info_data['details'];
        }

        output.page_info = this.pagecounter(jsonObj);
        // other data
        return output;
    }

}
