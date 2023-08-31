/**
 * F2100201-外匯存款帳戶交易明細查詢(綜活存)
 *  transDate;//	交易日期
 *  digest;//	摘要
 *  withdraw;//	存款金額
 *  deposit;//	提款金額
 *  balance;//	結餘金額
 *  rcvBankId;//	交易行庫代碼
 *  rcvBankName;//	交易行庫名稱
 *  currency;//	幣別
 *  currName;//	幣別名稱
 *  remarks;//	備註
 */
import { Injectable } from '@angular/core';
import { F2100201ResBody } from './f2100201-res';
import { F2100201ReqBody } from './f2100201-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { ContentSummaryApiUtil } from '@api/modify/content-summary-api-util';

@Injectable()
export class F2100201ApiService extends ApiBase<F2100201ReqBody, F2100201ResBody> {
    constructor(
        public telegram: TelegramService<F2100201ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F2100201');
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
  getPageData(req: object, page?: number, sort?: Array<any>, pageSize?: string | number): Promise<any> {
        const custId = this.authService.getCustId();
        if (custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', custId);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F2100201ReqBody = new F2100201ReqBody();
        data.paginator = this.modifyPageReq(data.paginator, page, sort);
    if (pageSize) {
      data.paginator.pageSize = pageSize;
    }
        data.custId = custId; // user info;
        data.acctNo = this._formateService.checkField(req, 'acctNo'); // 從api F2000101取得
        data.acctType = this._formateService.checkField(req, 'acctType'); // 從api F2000101取得
        data.currCode = this._formateService.checkField(req, 'currCode'); // 從api F2000201取得
        data.startDate = this._formateService.checkField(req, 'startDate');
        data.endDate = this._formateService.checkField(req, 'endDate');
        if (data.acctNo == '' || data.acctType == '' || data.startDate == '' || data.endDate == ''
            || data.currCode == ''
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
                    msg: 'ERROR.RSP_FORMATE_ERROR',
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
            summary_data: {}
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);
        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(jsonObj['details']['detail']);
            delete output.info_data['details'];
        }

        output.page_info = this.pagecounter(jsonObj);
        // other data
        output.summary_data = ContentSummaryApiUtil.modifyForex(resObj, 'F2100201');

        return output;
    }



}
