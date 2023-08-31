/**
 * F2000101-台幣帳戶查詢
 *     totlTimeDepositeAmt	定期性存款總金額,加總各定存帳戶餘額取得
 *     totlSaveAcctAmt	活期性存款總金額,加總各活存帳戶餘額取得
 *     totalAcctAmt	存款總金額,定期性存款總金額+活期性存款總金額
 * acctType
 *  CK:支票存款
 *  FD:定期存款
 *  MB:綜合存款
 *  PB:活期存款
 *  XS:外匯活期存款
 *  XM:外匯綜合存款
 *  XF:外匯定期存款
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F2000101ResBody } from './f2000101-res';
import { F2000101ReqBody } from './f2000101-req';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { TelegramOption } from '@core/telegram/telegram-option';

@Injectable()
export class F2000101ApiService extends ApiBase<F2000101ReqBody, F2000101ResBody> {
    constructor(
        public telegram: TelegramService<F2000101ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F2000101');
    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getPageData(page?: number, sort?: Array<any>, background?: boolean, pageSize?: string | number): Promise<any> {
        // 參數處理
        let option: TelegramOption = new TelegramOption();
        if (background === true) {
            option.background = true;
        }
        let data: F2000101ReqBody = new F2000101ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId; // user info;
        data.paginator = this.modifyPageReq(data.paginator, page, sort);
        if (typeof pageSize != 'undefined') {
            data.paginator.pageSize = pageSize.toString();
        }

        return this.send(data, option).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'ERROR.RSP_FORMATE_ERROR',
                    info_data: {},
                    data: [],
                    page_info: {},
                    totalPages: 1,
                    dataTime: ''
                };
                let modify_data = this._modifyRespose(resObj);
                output.dataTime = modify_data.dataTime;
                output.info_data = modify_data.info_data;
                output.data = modify_data.data;
                output.page_info = modify_data.page_info;
                output.totalPages = output.page_info['totalPages'];

                if (output.data.length <= 0) {
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
            page_info: {}
        };
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
        output.info_data = this._formateService.transClone(jsonObj);

        let check_obj = this.checkObjectList(jsonObj, 'details.detail');
        if (typeof check_obj !== 'undefined') {
            output.data = this.modifyTransArray(check_obj);
            delete output.info_data['details'];
        }

        output.page_info = this.pagecounter(jsonObj);
        // other data
        output.info_data['totlTimeDepositeAmt'] = this._formateService.checkField(output.info_data, 'totlTimeDepositeAmt');
        output.info_data['totlSaveAcctAmt'] = this._formateService.checkField(output.info_data, 'totlSaveAcctAmt');
        output.info_data['totalAcctAmt'] = this._formateService.checkField(output.info_data, 'totalAcctAmt');


        return output;
    }


}
