/**
 * F9000101-借款查詢
 * totalAmount	借貸總額度	String 9(14)V9(2)	1	99999999999999.99
 * details.detail	借款查詢列表	Element
 *      acctNo	帳號	String 9(13)	1
 *      balence	現欠餘額	String 9(14)V9(2)	1	99999999999999.99
 *      rate	目前利率	String 9(2)V9(3)	1	99.999
 *      lastInterRecDate	上次利息收訖日	String	1	YYYMMDD(民國年)
 *      expirDate	到期日	String	1	YYYMMDD(民國年)
 * paginatedInfo
 */
import { Injectable } from '@angular/core';
import { F9000101ResBody } from './f9000101-res';
import { F9000101ReqBody } from './f9000101-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Injectable()
export class F9000101ApiService extends ApiBase<F9000101ReqBody, F9000101ResBody> {
    constructor(
        public telegram: TelegramService<F9000101ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F9000101');

    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getPageData(page?: number, sort?: Array<any>): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F9000101ReqBody = new F9000101ReqBody();
        data.paginator = this.modifyPageReq(data.paginator, page, sort);
        data.custId = userData.custId; // user info;


        return this.send(data).then(

            (resObj) => {
                let output = {
                    status: false,
                    msg: 'ERROR.RSP_FORMATE_ERROR',
                    info_data: {},
                    data: [],
                    page_info: {},
                    totalPages: 1,
                    totalAmount: '',
                    dataTime: ''
                };
                let modify_data = this._modifyRespose(resObj);
                output.dataTime = modify_data.dataTime;
                output.info_data = modify_data.info_data;
                output.data = modify_data.data;
                output.page_info = modify_data.page_info;
                output.totalPages = output.page_info['totalPages'];
                output.totalAmount = modify_data.totalAmount;

                // 需回傳借款總額度(如果連借款額度都無 即為查無資料)
                if (output.data.length <= 0 && output.totalAmount == '') {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY',
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
            totalAmount: ''
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);
        output.totalAmount = this._formateService.checkField(jsonObj, 'totalAmount');

        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
            delete output.info_data['details'];
        }

        output.page_info = this.pagecounter(jsonObj);
        // other data

        return output;
    }


}
