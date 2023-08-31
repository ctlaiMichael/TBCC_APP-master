/**
 * OTP服務
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
// API
import { F1000106ApiService } from '@api/f1/f1000106/f1000106-api.service';
import { F1000107ApiService } from '@api/f1/f1000107/f1000107-api.service';
import { F1000106ReqBody } from '@api/f1/f1000106/f1000106-req';
import { F1000107ReqBody } from '@api/f1/f1000107/f1000107-req';
import { AuthCheckUtil } from '@shared/util/check/word/auth-check-util';
import { CheckService } from '@shared/check/check.service';
import { logger } from '@shared/util/log-util';

@Injectable()
export class DeviceBindService {
    /**
     * 參數處理
     */
    constructor(
        private _logger: Logger
        , private f1000106: F1000106ApiService
        , private f1000107: F1000107ApiService
        , private authService: AuthService
        , private _formateService: FormateService
        , private _checkService: CheckService
    ) { }

    /**
     * step bar選單
     * 申請: 填寫資料>裝置認證授權>啟用裝置認證>結果
     * bind: 啟用裝置認證>結果
     */
    getSetpBarMenu(type) {
        let output = [];
        if (type === 'apply') {
            output.push({
                id: 'apply',
                name: 'STEP_BAR.DEVICE_BIND.STEP1' // 填寫資料
            });
            output.push({
                id: 'identity',
                name: 'STEP_BAR.DEVICE_BIND.STEP2' // 裝置認證授權
            });
        }
        output.push({
            id: 'bind',
            name: 'STEP_BAR.DEVICE_BIND.STEP3' // 啟用裝置認證
        });
        output.push({
            id: 'result',
            name: 'STEP_BAR.DEVICE_BIND.STEP4', // 結果
            hidden: true // 執行此步驟時是否隱藏step bar
        });

        this._logger.step('OTP', 'getSetpBarMenu', type, output);
        return output;
    }

    /**
     * 檢查裝置綁定狀態:
	 * 1:未申請<br>
	 * 2:已申請且裝置未認證，認證密碼有效<br>
	 * 3:已申請且裝置未認證，認證密碼逾期 <br>
	 * 4:已申請且裝置已認證<br>
	 * 5:歸戶身分證已申請5組，但此裝置為第6組
     */
    checkAuth(): Promise<any> {
        let output = {
            status: false,
            msg: '',
            type: '',
            title: ''
        };

        return new Promise((resolve, reject) => {
            const OtpUserInfo = this.authService.getOtpUserInfo();
            const check_data = OtpUserInfo.checkBoundIDStatus();
            this._logger.step('OTP', 'checkAuth', check_data);
            if (check_data.status) {
                resolve(check_data);
            } else {
                reject(check_data);
            }
        });

    }

    /**
     * 申請
     */
    applyData(req): Promise<any> {
        let output = {
            status: false,
            msg: 'CHECK.EMPTY', // 請輸入正確資料
            data: '',
            errorType: 'check',
            error_list : {
                pswd: ''
            }
        };
        // check pwd
        let pswd = this._formateService.checkField(req, 'pswd');
        output.data = pswd;
        const check_data = AuthCheckUtil.checkOldPswd(pswd);
        if (!check_data.status) {
            output.status = false;
            output.msg = check_data.msg; // 只有一個欄位直接顯示
            output.data = check_data.data;
            output.error_list.pswd = check_data.msg;
            return Promise.reject(output);
        }
        pswd = check_data.data;

        let set_data = new F1000106ReqBody();
        set_data.password = pswd;

        return this.f1000106.send(set_data).then(
            (resObj) => {
                // 申請識別碼
                const OtpIdentity = this._formateService.checkField(resObj, 'OtpIdentity');
                return Promise.resolve(resObj);
            },
            (errorObj) => {
                return Promise.reject(errorObj);
            }
        );
    }

    /**
     * 異動
     */
    bindData(req): Promise<any> {
        let output = {
            status: false,
            msg: 'CHECK.EMPTY', // 請輸入正確資料
            data: {
                OtpIdentity: '',
                commonName: ''
            },
            errorType: 'check',
            error_list : {
                OtpIdentity: '',
                commonName: ''
            }
        };
        // cehck OtpIdentity
        let check_data = this.checkBindData(req);
        output.data = check_data.data;
        if (!check_data.status) {
            output.error_list = check_data.error_list;
            return Promise.reject(output);
        }

        let set_data = new F1000107ReqBody();
        set_data.OtpIdentity = check_data.data.OtpIdentity;
        set_data.commonName = check_data.data.commonName;


        return this.f1000107.send(set_data).then(
            (resObj) => {
                return Promise.resolve(resObj);
            },
            (errorObj) => {
                let output_error = errorObj;
                logger.debug("service errorObj:",errorObj);
                this._logger.step('OTP', 'bind error', this._formateService.transClone(errorObj));
                // 檢查是否為輸入錯誤3次，必須請使用者重新申請!!!
                if (errorObj.hasOwnProperty('_check') && errorObj['_check']) {
                    if (errorObj['_check']['stop'] === false) {
                        // 若認證密碼錯誤，顯示確定對話方塊(101/581)，按下確定，停在原畫面
                        // alert錯誤
                        output_error['errorType'] = 'check';
                        output_error['error_list'] = output.error_list;
                        output_error.error_list.OtpIdentity = 'PG_OTP.BIND.FIELD.BIND_IDENTITY_EDIT';
                    }
                }

                return Promise.reject(output_error);
            }
        );
    }

    /**
     * 檢查綁定欄位
     */
    checkBindData(req) {
        let output = {
            status: false,
            msg: 'ERROR.EMPTY', // 請輸入正確資料
            data: {
                OtpIdentity: '',
                commonName: ''
            },
            error_data: [],
            error_list: {
                OtpIdentity: '',
                commonName: ''
            }
        };
        // -- 授權碼檢查 -- //
        let errorIdentity = '';
        output.data.OtpIdentity = this._formateService.checkField(req, 'OtpIdentity');
        output.data.OtpIdentity = this._formateService.transEmpty(output.data.OtpIdentity);
        if (!this._checkService.checkEmpty(output.data.OtpIdentity, true, false)) {
            // 請輸入裝置認證密碼
            errorIdentity = 'PG_OTP.BIND.FIELD.BIND_IDENTITY_EDIT';
            output.error_list.OtpIdentity = errorIdentity;
            output.error_data.push(output.error_list.OtpIdentity);
        }

        // -- 好記名稱檢查 -- //
        let errorName = '';
        output.data.commonName = this._formateService.checkField(req, 'commonName');
        output.data.commonName = this._formateService.transEmpty(output.data.commonName);
        if (!this._checkService.checkEmpty(output.data.commonName, true, false)) {
            // 請輸入裝置好記名稱
            errorName = 'PG_OTP.BIND.FIELD.BIND_NICKNAME_ERROR';
        } else {
            // 檢查不可以有emoji圖示
            let str_check = this._checkService.checkText(output.data.commonName);
            if (!str_check.status) {
                errorName = str_check.msg;
            }
        }
        if (errorName !== '') {
            output.error_list.commonName = errorName;
            output.error_data.push(output.error_list.commonName);
        }


        if (output.error_data.length == 0) {
            output.status = true;
            output.msg = '';
        }
        return output;
    }


}


