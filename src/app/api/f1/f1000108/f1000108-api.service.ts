/**
 * F1000108-OTP功能申請
 * (新增、修改、刪除)
 *      custId	身分證字號
 *      action	設定動作
 *      phone	手機號碼
 *      email	電子信箱
 * [Response]
 *      result: 0-成功, 1-表失敗
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { F1000108ReqBody } from './f1000108-req';
import { F1000108ResBody } from './f1000108-res';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { logger } from '@shared/util/log-util';

@Injectable()
export class F1000108ApiService extends ApiBase<F1000108ReqBody, F1000108ResBody> {
    constructor(
        public telegram: TelegramService<F1000108ResBody>,
        public errorHandler: HandleErrorService,
        public authService: AuthService,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F1000108');
    }

    /**
     * OTP服務儲存
     * @param set_data 參數設定
     * @param security CheckSecurityService doSecurityNextStep 回傳物件
     */
    sendData(set_data: Object, security: any): Promise<any> {
        /**
         * 參數處理
         */

        let df_data: F1000108ReqBody = new F1000108ReqBody();
        let check_data = this.checkSecurity(set_data, true);
        if (!check_data) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        let data = {...df_data, ...check_data};
        let option = this.modifySecurityOption(security);
        if (!option.header) {
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return this.send(data, option).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'ERROR.RSP_FORMATE_ERROR',
                    dataTime: ''
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
                let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
                output.dataTime = this._formateService.checkField(jsonHeader, 'responseTime');
                if (!jsonObj.hasOwnProperty('result') || jsonObj['result'] != '0') {
                    // 處理失敗
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: 'ERROR.EDIT_ERROR',
                        data: jsonObj,
                        dataTime: output.dataTime
                    });
                }

                output.status = true;
                output.msg = '';


                // 設定成功需暫存 (重新登入後資料才會更新)
                const otp_modify_times = this.authService.getTmpInfo('otp_modifytime');
                let save_data = {
                    otp_modifytimes: 1,
                    OtpCustInfo: {}
                };
                if (!!otp_modify_times) {
                    save_data.otp_modifytimes = otp_modify_times + 1;
                }
                save_data.OtpCustInfo = this.authService.getTmpInfo('OtpCustInfo');
                if (!!save_data.OtpCustInfo) {
                    if (!!save_data.OtpCustInfo['PhoneNo']) {
                        save_data.OtpCustInfo['PhoneNo'] = data.phone;
                    }
                    if (!!save_data.OtpCustInfo['Email']) {
                        save_data.OtpCustInfo['Email'] = data.email;
                    }
                }
                this.authService.updateTmpInfo(save_data);
                logger.step('OTP', 'modify times', save_data, otp_modify_times, this.authService.getTmpInfo('OtpCustInfo'));

                return Promise.resolve(output);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * OTP服務儲存(安控參數)
     * @param set_data 參數設定
     */
    checkSecurity(set_data: Object, returnFlag?: boolean) {
        /**
         * 參數處理
         */
        let data = {
            custId : '', // 身分證字號
            action : '', // 設定動作
            phone : '', // 手機號碼
            email : '' // 電子信箱
        };
        const custId = this.authService.getCustId();
        if (custId == '') {
            return false;
        }
        const OtpUserInfo = this.authService.getOtpUserInfo();
        const user_email = OtpUserInfo.getUserOtpData('email'); // email目前已使用者設定內資料為準
        data.custId = custId; // user info;
        data.phone = this._formateService.checkField(set_data, 'phone');
        // data.email = this._formateService.checkField(set_data, 'email'); // email目前已使用者設定內資料為準
        data.email = user_email;
        // data.action = this._formateService.checkField(set_data, 'action'); // 目前不抓前端送來，以使用者資訊判斷
        if (OtpUserInfo.checkApplyOTP()) {
            data.action = '2'; // 異動
        } else {
            data.action = '1'; // 申請
        }
        if (data.phone == '') {
            return false;
        }
        // 回傳資料進行安控處理 (憑證)
        if (returnFlag) {
            return data;
        } else {
            return {
                signText: data,
                serviceId: 'F1000108',
                securityType: '2',
                transAccountType: '1'
            };
        }
    }


}
