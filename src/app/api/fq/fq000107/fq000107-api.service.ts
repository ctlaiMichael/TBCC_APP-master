/**
 * QR Code繳費-繳卡費
 */
import { Injectable } from '@angular/core';
import { FQ000107ReqBody } from './fq000107-req';
import { FQ000107ResBody } from './fq000107-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { EpayApiUtil } from '@api/modify/epay-api-util';

@Injectable()
export class FQ000107ApiService extends ApiBase<FQ000107ReqBody, FQ000107ResBody> {

    constructor(
        public telegram: TelegramService<FQ000107ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'FQ000107');
    }


    /**
     * 繳卡費
     * @param set_data 參數設定
     * @param security CheckSecurityService doSecurityNextStep 回傳物件
     */
    sendData(set_data: Object, token: string, security: any): Promise<any> {
        /**
         * 參數處理
         */

        let df_data: FQ000107ReqBody = new FQ000107ReqBody();
        let check_data = this.checkSecurity(set_data, token, true);
        if (!check_data) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        let data = { ...df_data, ...check_data };
        let option = this.modifySecurityOption(security);
        if (!option.header) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return this.send(data, option).then(
            (resObj) => {
                let output = EpayApiUtil.modifyResponse(resObj);
                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 繳卡費(安控參數)
     * @param set_data 參數設定
     */
    checkSecurity(set_data: Object, token: string, returnFlag?: boolean) {
        /**
         * 參數處理
         */
        let df_data: FQ000107ReqBody = new FQ000107ReqBody();
        const custId = this.authService.getCustId();
        if (custId == '') {
            return false;
        }
        if (token == '') {
            return false;
        }

        let data = {...df_data, ...set_data};
        data.custId = custId; // user info;
        data.trnsToken = token;

        // 交易金額
        let tmp_amt: any = this._formateService.checkField(set_data, 'txnAmt');
        tmp_amt = parseFloat(tmp_amt) * 100;
        data.txnAmt = tmp_amt.toString();

        let noticeNbr = this._formateService.checkField(set_data, 'noticeNbr');
        if (noticeNbr !== '') {
            // 20180906加入encodeURI與replace("%20","+")
            data.noticeNbr = encodeURI(noticeNbr).split('%20').join('+');
        }

        let otherInfo = this._formateService.checkField(set_data, 'otherInfo');
        if (otherInfo !== '') {
            data.otherInfo = encodeURI(otherInfo);
        }

        let merchantName = this._formateService.checkField(set_data, 'merchantName');
        if (merchantName !== '') {
            data.merchantName = encodeURI(merchantName);
        }

        // 回傳資料進行安控處理 (憑證)
        if (returnFlag) {
            return data;
        } else {
            return {
                signText: data,
                serviceId: 'FQ000107',
                securityType: '',
                transAccountType: ''
            };
        }
    }


}



