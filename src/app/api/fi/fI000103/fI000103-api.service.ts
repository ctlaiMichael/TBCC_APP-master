/**
 * Fi100103-基金交易明細查詢
 *  transCode;//	交易編號
 *  fundCode;//	基金代碼
 *  startDate;//	查詢起日
 *  endDate;//	查詢迄日
 */
import { Injectable } from '@angular/core';
import { FI000103ResBody } from './fI000103-res';
import { FI000103ReqBody } from './fI000103-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { ContentSummaryApiUtil } from '@api/modify/content-summary-api-util';

@Injectable()
export class FI000103ApiService extends ApiBase<FI000103ReqBody, FI000103ResBody> {
    constructor(
        public telegram: TelegramService<FI000103ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FI000103');
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getPageData(req: object, page?: number, sort?: Array<any>): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: FI000103ReqBody = new FI000103ReqBody();
        data.paginator = this.modifyPageReq(data.paginator, page, sort);
        data.custId = userData.custId; // user info;
        data.transCode = this._formateService.checkField(req, 'transCode'); // 從api FI000103取得
        data.fundCode = this._formateService.checkField(req, 'fundCode'); // 從api FI000103取得
        data.startDate = this._formateService.checkField(req, 'startDate');
        data.endDate = this._formateService.checkField(req, 'endDate');
        if (data.transCode == '' || data.fundCode == '' || data.startDate == '' || data.endDate == ''
        ) {
            this._logger.error('DATA_FORMAT_ERROR api req', data, req);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }

        // 民國年, yyyMMdd
        data.startDate = this._formateService.transDate(data.startDate, { formate: 'yyyMMdd', chinaYear: true});
        data.endDate = this._formateService.transDate(data.endDate, { formate: 'yyyMMdd', chinaYear: true});


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
                output.summary_data = modify_data.summary_data;

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
            summary_data: {}
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
        output.summary_data = ContentSummaryApiUtil.modifyForex(resObj, 'F2100201');

        return output;
    }



}
