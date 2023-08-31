/**
 * F2100104-臺幣帳戶交易明細查詢(帳戶彙總支存)
 * acctType = CK
 *
 * Response:
 * realBalance	實質餘額
 * usefulBalance	可用餘額
 * todayCheckBalance	金交票金額
 * tomCheckBalance	名交票金額
 * icCard	消費圈存
 * freezeBalance	凍結總額
 * distrainBalance	扣押總額
 * afterRunBalance	營業時間後提款及轉出
 * afterRunPay	營業時間後存款及轉入
 * financeRate	融資利率
 * financeAmount	融資額度
 * financeStartDay	融資期間(起)
 * financeEndDay	融資期間(訖)
 */
import { Injectable } from '@angular/core';
import { F2100104ResBody } from './f2100104-res';
import { F2100104ReqBody } from './f2100104-req';


import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { ContentSummaryApiUtil } from '@api/modify/content-summary-api-util';

@Injectable()
export class F2100104ApiService extends ApiBase<F2100104ReqBody, F2100104ResBody> {
    constructor(
        public telegram: TelegramService<F2100104ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F2100104');
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getData(req): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F2100104ReqBody = new F2100104ReqBody();
        // data.paginator = this.modifyPageReq(data.paginator, page, sort);
        data.custId = userData.custId; // user info;
        data.acctNo = this._formateService.checkField(req, 'acctNo');
        data.acctType = this._formateService.checkField(req, 'acctType'); // 從api F2000101取得
        if (data.acctNo == '' || data.acctType == '' ) {
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
                    msg: 'ERROR.RSP_FORMATE_ERROR',
                    data: {},
                    dataTime: ''
                };

                let modify_data = ContentSummaryApiUtil.modifyTW(resObj, 'F2100104');
                output.data = modify_data.data;
                output.dataTime = modify_data.dataTime;

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
