/**
 * OTP服務
 */
import { Injectable, Output } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';
import { CertService } from '@lib/plugins/tcbb/cert.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { ProvisionOptions } from '@base/options/provision-options';
import { OtpApplyProvision } from '@conf/terms/otp/otp-apply-provision';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice'; // 安控
// API
import { F1000108ApiService } from '@api/f1/f1000108/f1000108-api.service';
import { CheckService } from '@shared/check/check.service';
import { UserCheckUtil } from '@shared/util/check/data/user-check-util';

@Injectable()
export class OtpServiceService {
    /**
     * 參數處理
     */
    constructor(
        private _logger: Logger
        , private f1000108: F1000108ApiService
        , private _formateService: FormateService
        , private authService: AuthService
        , private certService: CertService
        , private _checkService: CheckService
        , private _checkSecurityService: CheckSecurityService
    ) { }

    /**
     * step bar選單
     */
    getSetpBarMenu(type: string) {
        let output = [];
        if (type === 'add') {
            // 新增
            output.push({
                id: 'agree',
                name: 'STEP_BAR.OTP_SERVICE.STEP0' // 申請約定條款
            });
        }
        output.push({
            id: 'form',
            name: 'STEP_BAR.OTP_SERVICE.STEP1' // 填寫資料
        });
        output.push({
            id: 'check',
            name: 'STEP_BAR.OTP_SERVICE.STEP2' // 填寫憑證保護密碼
        });
        output.push({
            id: 'result',
            name: 'STEP_BAR.OTP_SERVICE.STEP3' // 結果
        });
        return output;
    }

    getProvision() {
        return new OtpApplyProvision();
    }

    /**
     * 檢查申請狀態或是否可以申請: 線上OTP申請與變更僅提供憑證權限
     * [規則]
     * 線上OTP申請與異動，僅提供有憑證之用戶!
     * 申請: 有憑證且有下載之用戶才可進行線上申請，其他請顯示訊息: 您尚未申請OTP服務，請洽本行各營業單位辦理。
     * 異動: 有憑證且有下載之用戶才可進行線上變更，其他僅提供顯示資訊
     * 申請與異動email欄位不提供編輯，請自動待登入資訊內的email
     */
    checkAuth(): Promise<any> {
        let output = {
            status: false,
            msg: '',
            type: '', // apply 申請、edit 異動、read 閱讀
            title: '',
            readOnlyFlag: false,
            haveCA: false,
            data: {
                phone: {
                    show: true,
                    readOnlyFlag: false,
                    require: true, // 是否必填
                    oldtitle: '', // 舊資料欄位名稱
                    oldval: '', // 原始資料
                    title: '', // 欄位名稱
                    placeholder: '' // 輸入注意事項
                },
                email: {
                    show: false, // 目前不提供email
                    readOnlyFlag: false,
                    require: false, // 是否必填
                    oldtitle: '', // 舊資料欄位名稱
                    oldval: '', // 原始資料
                    title: '', // 欄位名稱
                    placeholder: '' // 輸入注意事項
                }
            }
        };
        const OtpUserInfo = this.authService.getOtpUserInfo();
        const check_apply = OtpUserInfo.getApplyOTPStatus();
        if (!check_apply.status) {
            // 無憑證且也未啟用OTP服務時，點「OTP服務」: 您尚未申請OTP服務，請洽本行各營業單位辦理。
            // 若OTP已申請(是可以進行變更)，但事故狀態為停止或密碼狀態為鎖定，用戶點選「OTP服務」時，顯示確定對話方塊(576)
            return Promise.reject(check_apply);
        }
        output.type = check_apply.type;
        output.haveCA = check_apply.haveCA;
        output.readOnlyFlag = check_apply.readOnlyFlag;
        if (check_apply.readOnlyFlag === true) {
            output.data.phone.readOnlyFlag = true;
            output.data.email.readOnlyFlag = true;
        }


        // OTP申請(事故狀態與密碼狀態無值)
        output.data.phone.oldtitle = 'PG_OTP.SERVICE.FIELD.PHONE'; // 原欄位用戶手機號碼
        output.data.email.oldtitle = 'PG_OTP.SERVICE.FIELD.EMAIL'; // 原欄位電子郵件信箱
        if (output.type == 'edit' || output.type == 'read') {
            // 編輯
            output.title = 'PG_OTP.SERVICE.FIELD.EDIT.TITLE'; // OTP變更
            output.data.email.oldval = check_apply.data.email;
            output.data.phone.oldval = check_apply.data.phone;
            output.data.phone.title = 'PG_OTP.SERVICE.FIELD.EDIT.PHONE'; // 變更後用戶手機號碼
            output.data.phone.placeholder = 'PG_OTP.SERVICE.FIELD.EDIT.PHONE_EDIT'; // 請輸入變更後用戶手機號碼
            output.data.email.title = 'PG_OTP.SERVICE.FIELD.EDIT.EMAIL'; // 變更後電子郵件信箱
            output.data.email.placeholder = 'PG_OTP.SERVICE.FIELD.EDIT.EMAIL_EDIT'; // 請輸入變更後電子郵件信箱
        } else {
            // 新增
            output.title = 'PG_OTP.SERVICE.FIELD.TITLE'; // OTP申請
            output.data.phone.title = 'PG_OTP.SERVICE.FIELD.PHONE'; // 用戶手機號碼
            output.data.phone.placeholder = 'PG_OTP.SERVICE.FIELD.PHONE_EDIT'; // 請輸入用戶手機號碼
            output.data.email.title = 'PG_OTP.SERVICE.FIELD.EMAIL'; // 電子郵件信箱
            output.data.email.placeholder = 'PG_OTP.SERVICE.FIELD.EMAIL_EDIT'; // 請輸入電子郵件信箱
        }

        output.status = true;
        output.msg = '';
        return Promise.resolve(output);
    }

    /**
     * 申請/異動
     */
    async sendData(req, info_data, editFlag): Promise<any> {
        let output = {
            status: false,
            msg: 'CHECK.EMPTY', // 請輸入正確資料
            data: {
                phone: '',
                email: ''
            },
            errorType: 'check',
            error_list: {
                phone: '',
                email: ''
            },
            resultData: {
                classType: 'error',
                title: '',
                content: '',
                content_params: {}
            }
        };
        this._formateService.checkObjectList(info_data, 'info_data.phone.oldval');

        const check_data = this.checkOtpData(req, editFlag);
        output.data = check_data.data;
        if (!check_data.status) {
            output.error_list = check_data.error_list;
            return Promise.reject(output);
        }

        let set_data = {
            'action': '1',
            'phone': output.data.phone,
            'email': '' // 暫不開放
        };
        set_data['action'] = (editFlag) ? '2' : '1';

        // 取得欲簽章本文
        let set_security: any;
        try {
            set_security = await this.f1000108.checkSecurity(set_data);
        } catch (error_security) {
            // 解析失敗回傳
            return Promise.reject(error_security);
        }

        // 進行安控處理
        let security: any;
        try {
            security = await this._checkSecurityService.doSecurityNextStep(set_security);
        } catch (error_dosecurity) {
            // 解析失敗回傳
            this._logger.step('OTP', 'error do', error_dosecurity);
            return Promise.reject(error_dosecurity);
        }

        return this.f1000108.sendData(set_data, security).then(
            (resObj) => {
                let show_title = '';
                let show_content = '';
                if (editFlag) {
                    // 完成OTP變更
                    show_title = 'PG_OTP.ERROR.OTP_TITLE_MODIFY_SUCCESS';
                    // 您已於{{ date }}變更OTP完成。
                    show_content = 'PG_OTP.ERROR.OTP_MODIFY_SUCCESS';
                } else {
                    // 完成OTP申請
                    show_title = 'PG_OTP.ERROR.OTP_TITLE_APPLY_SUCCESS';
                    // 您已於{{ date }}申請OTP完成。
                    show_content = 'PG_OTP.ERROR.OTP_APPLY_SUCCESS';
                }

                output.status = true;
                output.errorType = '';
                output.resultData = {
                    classType: 'success',
                    title: show_title,
                    content: show_content,
                    content_params: { date: this._formateService.transDate(resObj.dataTime, 'date') }
                };
                return Promise.resolve(output);
            },
            (errorObj) => {
                output.errorType = 'api';
                output.msg = 'ERROR.RSP_FORMATE_ERROR';
                let show_title = 'PG_OTP.ERROR.OTP_TITLE_MODIFY_ERROR';
                let show_content = 'ERROR.RSP_FORMATE_ERROR';
                if (!editFlag) {
                    // 完成OTP變更
                    show_title = 'PG_OTP.ERROR.OTP_TITLE_APPLY_ERROR';
                }
                if (errorObj && errorObj.hasOwnProperty('content') && errorObj['content'] !== '') {
                    show_content = errorObj['content'];
                }
                output.resultData = {
                    classType: 'error',
                    title: show_title,
                    content: show_content,
                    content_params: {}
                };

                return Promise.reject(output);
            }
        );

    }

    /**
     * 檢查綁定欄位
     * 檢核:
     *  1. 無輸入：(僅新增)
     *  1. 無異動檢查：(僅異動)
     *     (A)檢查電話＋Email都為空值
     *     (B)檢查電話為空值＋Email為原值
     *     (C)檢查電話為原值＋Email都為空值
     *     (D)檢查電話＋Email都為原值
     *  2. 檢查電話(新增+變更)
     *  3. 檢查Email(新增+變更)
     */
    checkOtpData(req, editFlag) {
        let output = {
            status: false,
            msg: 'CHECK.EMPTY', // 請輸入正確資料
            data: {
                phone: '',
                email: ''
            },
            error_data: [],
            error_list: {
                phone: '',
                email: ''
            }
        };
        // -- 重新取得原客戶資料 -- //
        const OtpUserInfo = this.authService.getOtpUserInfo();
        let oldval = {
            phone: OtpUserInfo.getUserOtpData('phone'),
            email: OtpUserInfo.getUserOtpData('email')
        };
        // 使用位數來判斷
        let check_flag = {
            empty_phone: false,
            empty_email: false,
            same_phone: false,
            same_email: false
        };
        // -- phone檢查 -- //
        let errorPhone = '';
        output.data.phone = this._formateService.checkField(req, 'phone', { trim_flag: true });
        if (output.data.phone == oldval.phone) {
            check_flag.same_phone = true;
        }
        if (!this._checkService.checkEmpty(output.data.phone, true, false)) {
            // 請輸入用戶手機號碼
            check_flag.empty_phone = true;
            errorPhone = 'PG_OTP.SERVICE.FIELD.PHONE_EDIT';
            output.error_list.phone = errorPhone;
            output.error_data.push(output.error_list.phone);
        } else {
            const check_phone = UserCheckUtil.checkMobile(output.data.phone);
            if (!check_phone.status) {
                errorPhone = 'PG_OTP.ERROR.ERROR_PHONE'; // 用戶手機號碼必須為10碼純數字，請您重新輸入。
                // errorPhone = check_phone.msg;
                output.error_list.phone = errorPhone;
                output.error_data.push(output.error_list.phone);
            }
        }
        // -- email檢查 -- // (目前無此欄位)
        let errorEmail = '';
        output.data.email = this._formateService.checkField(req, 'email', { trim_flag: true });
        if (output.data.email == oldval.email) {
            check_flag.same_email = true;
        }
        if (!this._checkService.checkEmpty(output.data.email, true, false)) {
            // email非必填，故如果為空不檢核
            // 請輸入email
            check_flag.empty_email = true;
            // errorEmail = 'PG_OTP.ERROR.ERROR_EMAIL'; // 電子郵件信箱格式錯誤，請重新輸入。
            // output.error_list.email = errorEmail;
            // output.error_data.push(output.error_list.email);
        } else {
            const check_email = UserCheckUtil.checkEmail(output.data.email);
            if (!check_email.status) {
                errorEmail = 'PG_OTP.ERROR.ERROR_EMAIL'; // 電子郵件信箱格式錯誤，請重新輸入。
                // errorEmail = check_email.msg;
                output.error_list.email = errorEmail;
                output.error_data.push(output.error_list.email);
            }
        }

        // 異動類別
        if (editFlag) {
            if (check_flag.empty_phone && (check_flag.empty_email || check_flag.same_email)
                || (check_flag.same_phone && check_flag.same_email)
            ) {
                // (A)檢查電話＋Email都為空值
                // (B)檢查電話為空值＋Email為原值
                // (D)檢查電話＋Email都為原值
                output.msg = 'CHECK.NO_CHANGE'; // 您未異動任何項目。
                output.error_data.push(output.msg);
            } else if (check_flag.same_phone && check_flag.empty_email) {
                // (C)檢查電話為原值＋Email都為空值
                output.msg = 'CHECK.NO_CHANGE'; // 您未異動任何項目。
                output.error_list.phone = output.msg;
                output.error_data.push(output.msg);
            }
        } else if (output.error_list.phone !== '') {
            // 新增: 因為目前只有phone，所以msg等於phone
            output.msg = output.error_list.phone;
        }

        if (output.error_data.length == 0) {
            output.status = true;
            output.msg = '';
        }
        return output;
    }

}


