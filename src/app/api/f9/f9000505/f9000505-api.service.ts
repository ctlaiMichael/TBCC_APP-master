/**
 * F9000505-查詢個人帳號(房貸)
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
import { F9000505ResBody } from './f9000505-res';
import { F9000505ReqBody } from './f9000505-req';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';

@Injectable()
export class F9000505ApiService extends ApiBase<F9000505ReqBody, F9000505ResBody> {
    constructor(
        public telegram: TelegramService<F9000505ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F9000505');
    }

    /**
     *
     * 
     */
    sendData(req): Promise<any> {
        // 參數處理
        let data: F9000505ReqBody = new F9000505ReqBody();
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        data.custId = userData.custId; // user info;

        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'ERROR.RSP_FORMATE_ERROR',
                    info_data: {},
                    data: [],
                };
                let modify_data = this._modifyRespose(resObj);
                output.info_data = modify_data.info_data;
                output.data = modify_data.data;
                modify_data.data.forEach((item) => {
                    if (item.balance == '' || typeof item.balance == 'undefined'
                        || item.balance == null) {
                        item.balance = '--';
                    }
                    if(item.openBranchName == '' || typeof item.openBranchName == 'undefined'
                    || item.openBranchName == null) {
                        item.openBranchName = '--';
                    }
                });

                if (output.data.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EMPTY',
                        data: output,
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
