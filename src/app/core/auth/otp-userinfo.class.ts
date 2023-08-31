/**
 * OTP資訊、裝置綁定資訊處理與判斷
 * (使用時每次取得最新資料，確保資料正確)
 */
import { AuthUserInfo } from '@core/auth/auth-userinfo';
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { TmpUserInfo } from '@core/auth/tmp-userinfo';
import { environment } from '@environments/environment';
export class OtpUserInfo {
    /**
     * 參數處理
     */
    private loginFlag: boolean;
    private downloadCA: boolean;
    // 使用者otp資訊
    private userOTPInfo = {
        phone: '',
        email: ''
    };

    /**
     * 簡訊密碼申請狀態
     * 1：未申請
     * 2：已申請
     */
    protected OTPID: string;

    /**
     * 簡訊密碼申請狀態
     *  0:正常
     *  1:停止
     *  空白:未申請OTP
     */
    protected AuthStatus: string;

    /**
     * 密碼狀態
     *  0:正常
     *  1:鎖定
     *  空白:未申請OTP
     */
    protected PwdStatus: string;

    /**
     * 1：未申請
     * 2：已申請且裝置未認證，認證密碼有效
     * 3：已申請且裝置未認證，認證密碼逾期
     * 4：已申請且裝置已認證
     * 5：歸戶身分證已申請5組，但此裝置為第6組
     * 僅登入成功取得之資訊
     */
    protected BoundID: string;

    /**
     * 當前BoundID狀態(依照執行功能變化)
     */
    protected BindData = {
        BoundID: '',
        identity: ''
    };


    constructor(
        protected userData: AuthUserInfo,
        protected isLoggedin: boolean,
        protected isDownloadCA: boolean,
        protected tmpInfo: TmpUserInfo
    ) {
        this.loginFlag = (this.isLoggedin) ? true : false;
        this.downloadCA = (this.isDownloadCA) ? true : false;
        if (this.loginFlag) {
            this._initEvent();
        }
    }

    /**
     * 取得otp使用者資訊
     * @param set_key 可取得指定資料
     *      phone 使用者手機
     *      email 使用者email
     */
    getUserOtpData(set_key?: string): any {
        let output: any = ObjectUtil.clone(this.userOTPInfo);
        if (typeof set_key !== 'undefined') {
            output = FieldUtil.checkField(output, set_key);
        }
        return output;
    }

    /**
     * 判斷是否允許使用OTP安控
     * @param checkBind 是否檢查裝置綁定狀態
     */
    checkOtpAllow(checkBind: boolean = false ): boolean  {
        let output = false;
        if (this.checkApplyOTP() && this.checkAuthStatus() && this.checkPwdStatus()) {
            output = true;
            if (checkBind && !this.checkBindStatus()) {
                // 需要檢核裝置綁定
                output = false;
            }
        }
        return output;
    }


    /**
     * 檢查是否有申請OTP
     * @returns [boolean]
     * true 已申請
     * flase 未申請/異常
     */
    checkApplyOTP(): boolean {
        return (this.OTPID == '2') ? true : false;
    }

    /**
     * 取得 事故狀態[AuthStatus]
     * 0:正常, 1:停止, 空白:未申請OTP, X 異常
     * @returns [boolean]
     * true 正常可使用
     * flase 鎖定/未申請/異常
     */
    checkAuthStatus(): boolean {
        let output = false;
        if (this.checkApplyOTP() && this.AuthStatus == '0') {
            output = true;
        }
        return output;
    }

    /**
     * 取得 密碼狀態[PwdStatus]
     * 0:正常, 1:鎖定, 空白:未申請OTP, X 異常
     * @returns [boolean]
     * true 正常可使用
     * flase 鎖定/未申請/異常
     */
    checkPwdStatus(): boolean {
        let output = false;
        if (this.checkApplyOTP() && this.PwdStatus == '0') {
            output = true;
        }
        return output;
    }

    /**
     * 檢查是否裝置綁定
     * 4:已申請且裝置已認證
     */
    checkBindStatus(): boolean {
        let output = false;
        if ( this.BoundID == '4') {
            output = true;
        }
        return output;
    }

    /**
     * 判斷OTP是否可使用
     */
    checkOtpAllowStatus() {
        let output = {
            status: false,
            bind: false,
            apply: false,
            msg: '',
            otpId: '',
            authStatus: '',
            pwdStatus: ''
        };
        if (this.checkOtpAllow(true)) {
            output.status = true;
            output.bind = true;
            output.apply = true;
        } else {
            let error_list = [];
            if (this.checkBindStatus()) {
                output.bind = true;
            }
            if (this.checkApplyOTP()) {
                output.apply = true;
            }
            if (this.OTPID == '1') {
                output.otpId = 'OTP簡訊密碼尚未申請';
                error_list.push(output.otpId);
            }
            // 事故狀態 1:停止 空白:未申請OTP
            if (this.AuthStatus == '1') {
                output.authStatus = 'OTP已停止';
                error_list.push(output.authStatus);
            } else if (this.AuthStatus == '') {
                output.authStatus = '尚未申請OTP';
                error_list.push(output.authStatus);
            }
            // 密碼狀態  1:鎖定 空白:未申請OTP
            if (this.PwdStatus == '1') {
                output.pwdStatus = 'OTP密碼已鎖定';
                error_list.push(output.pwdStatus);
            } else if (this.PwdStatus == '') {
                output.pwdStatus = '尚未申請OTP密碼';
                error_list.push(output.pwdStatus);
            }
            if (error_list.length > 0) {
                output.msg = error_list.join(",");
            }
        }
        return output;
    }

    /**
     * [專用] OTP申請異動專用
     * OTP申請異動檢核
     * [規則]
     * 線上OTP申請與異動，僅提供有憑證之用戶!
     * 申請: 有憑證且有下載之用戶才可進行線上申請，其他請顯示訊息: 您尚未申請OTP服務，請洽本行各營業單位辦理。
     * 異動: 有憑證且有下載之用戶才可進行線上變更，其他僅提供顯示資訊
     * 申請與異動email欄位不提供編輯，請自動待登入資訊內的email
     *
     * 1. 取得檢查資訊
     * 1.1 判斷是否下載憑證
     * 1.2 自F1000101.OTPID 決定 OTPID=2為異動，其他為新增( checkApplyOTP()==true 為異動 )
     * 1.3 自F1000101.AuthStatus (事故狀態) 決定
     * 2. 判斷
     * 2.1 申請狀態: 無憑證且也未啟用OTP服務時，點「OTP服務」，提示訊息: 您尚未申請OTP服務，請洽本行各營業單位辦理。
     * 2.2 異動狀態: 若OTP已申請(是可以進行變更)，但事故狀態為停止或密碼狀態為鎖定，用戶點選「OTP服務」時，顯示確定對話方塊(576)
     */
    getApplyOTPStatus() {
        let output = {
            status: false,
            title: 'ERROR.TITLE',
            msg: '',
            type: 'add',  // add 申請、edit 異動、read 閱讀
            classType: 'error',
            readOnlyFlag: false,
            haveCA: false,
            data: {
                email: '',
                phone: ''
            }
        };
        output.haveCA = this.downloadCA;
        if (!this.checkApplyOTP()) {
            // 新增
            output.status = true;
            output.type = 'add';
            // 無憑證且也未啟用OTP服務時，點「OTP服務」: 您尚未申請OTP服務，請洽本行各營業單位辦理。
            if (!this.downloadCA) {
                output.status = false;
                // 您尚未申請OTP服務，請洽本行各營業單位辦理。
                output.msg = 'PG_OTP.ERROR.1101';
                output.classType = 'warning';
            }
        } else {
            // 編輯
            output.type = 'edit';
            output.data = ObjectUtil.clone(this.userOTPInfo);
            // 若OTP已申請(是可以進行變更)，但事故狀態為停止或密碼狀態為鎖定，用戶點選「OTP服務」時，顯示確定對話方塊(576)
            if (!this.checkAuthStatus() || !this.checkPwdStatus()) {
                output.status = false;
                // 本項服務須使用「OTP」轉帳機制始得進行交易，您目前「OTP」轉帳機制為非正常狀態，請洽本行各營業單位辦理，或使用網路銀行憑證載具線上申請。
                output.msg = 'PG_OTP.ERROR.576';
                output.classType = 'error';
            } else {
                output.status = true;
                if (!this.downloadCA) {
                    // 當無下載憑證，不提供編輯，僅提供顯示
                    output.readOnlyFlag = true;
                    output.type = 'read';
                }
            }
        }

        if (output.status) {
            output.msg = '';
            output.classType = 'success';
        }
        return output;
    }

    /**
     * [專用] 裝置綁定功能專用
     * 裝置綁定狀態檢核 [handleDEVICEBUNDLE] BoundID
     * 1:未申請<br>
     * 2:已申請且裝置未認證，認證密碼有效<br>
     * 3:已申請且裝置未認證，認證密碼逾期 <br>
     * 4:已申請且裝置已認證<br>
     * 5:歸戶身分證已申請5組，但此裝置為第6組
     */
    checkBoundIDStatus() {
        let output = {
            status: false, // true 表示可申請, false 表示不可申請
            msg: '',
            classType: 'error',
            type: '', // apply 新申請, bind 密碼綁定
            bound_id: this.BoundID,
            identity: ''
        };
        let tmp_identity = '';
        if (this.BindData.BoundID !== '' && this.BoundID !== this.BindData.BoundID) {
            output.bound_id = this.BindData.BoundID; // 資料變化
            tmp_identity = this.BindData.identity; // 暫存識別碼 (暫時不儲存)
        }

        switch (output.bound_id) {
            case '1': // 未申請
                output.status = true;
                output.type = 'apply';
                output.msg = '';
                break;
            case '3': // 已申請且裝置未認證，認證密碼逾期
                // 您已申請裝置認證作業，認證密碼已逾時失效。請您重新申請。
                output.status = true;
                output.type = 'apply';
                output.msg = 'PG_OTP.ERROR.BOUNDID_TIMEOUT';
                break;
            case '2': // 已申請且裝置未認證，認證密碼有效
                // 您目前已申請一組裝置認證密碼尚未啟用。您是否要使用該裝置認證密碼啟用目前裝置？
                output.status = true;
                output.msg = 'PG_OTP.ERROR.577';
                output.type = 'bind';
                output.identity = tmp_identity;
                break;
            case '4': // 已申請且裝置已認證
                // 您目前的裝置已完成認證。歡迎您多加利用本行多元便利的行動網銀服務。
                output.status = false;
                output.msg = 'PG_OTP.ERROR.578';
                output.classType = 'success';
                break;
            case '5': // 歸戶身分證已申請5組，但此裝置為第6組
                // 您的裝置認證啟用作業已達五組裝置。若欲新增此裝置認證，請您至網路銀行對已申請的五組裝置任一組裝置進行刪除作業。
                output.status = false;
                output.msg = 'PG_OTP.ERROR.579';
                output.classType = 'warning';
                break;
            default: // 無法辨識
                // 很抱歉，發生未預期的錯誤！如造成您的困擾，敬請見諒。若有其他疑問，請聯繫客服中心。
                output.status = false;
                output.msg = 'ERROR.DEFAULT';
                output.classType = 'warning';
                break;
        }
        if (output.status) {
            output.classType = '';
        }

        return output;
    }

    /**
     * [專用] KYC
     * KYC用 檢查安控可用OTP與否
     */
    checkKycOtp() {
        return this.checkOtpAllow(true);
        // return this.checkOtpAllow(false); // 無檢核裝置綁定
    }


    /**
     * [專用] 台幣轉帳
     * 台幣轉帳用 檢查安控可用OTP與否
     */
    checkTransferOtp() {
        return this.checkOtpAllow(false);
    }

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------
    private _initEvent() {
        this.OTPID = FieldUtil.checkField(this.userData, 'OTPID');
        this.BoundID = FieldUtil.checkField(this.userData, 'BoundID');
        this.BindData.BoundID = FieldUtil.checkField(this.tmpInfo, 'BoundID');
        this.BindData.identity = FieldUtil.checkField(this.tmpInfo, 'BIND_identity');
        if (!environment.ONLINE) {
            // 測試區塊
            // this.BoundID = '2'; // test (或者登入待碼請使用BIND_1~5)
            // this.OTPID = '1'; // test (或者登入待碼請使用OTP_1~2)
            this.downloadCA = true; // test
        }

        // OTP已申請才處理資料
        const have_apply = this.checkApplyOTP();
        if (have_apply) {
            if (ObjectCheckUtil.checkObject(this.userData, 'OtpSttsInfo')) {
                const OtpSttsInfo = this.userData['OtpSttsInfo'];
                this.AuthStatus = FieldUtil.checkField(OtpSttsInfo, 'AuthStatus');
                this.PwdStatus = FieldUtil.checkField(OtpSttsInfo, 'PwdStatus');
            }
            if (ObjectCheckUtil.checkObject(this.tmpInfo, 'OtpCustInfo')) {
                // 主要以暫存資料為主
                const OtpCustInfo = this.tmpInfo['OtpCustInfo'];
                this.userOTPInfo.phone = FieldUtil.checkField(OtpCustInfo, 'PhoneNo');
                this.userOTPInfo.email = FieldUtil.checkField(OtpCustInfo, 'Email');
            }
            // if (ObjectCheckUtil.checkObject(this.userData, 'OtpCustInfo')) {
            //     const OtpCustInfo = this.userData['OtpCustInfo'];
            //     this.userOTPInfo.phone = FieldUtil.checkField(OtpCustInfo, 'PhoneNo');
            //     this.userOTPInfo.email = FieldUtil.checkField(OtpCustInfo, 'Email');
            // }
        }

    }


    private checkLogin() {
        let output = {
            status: false,
            msg: 'ERROR.LOGIN.NO_LOGIN'
        };
        if (this.loginFlag) {
            output.status = true;
            output.msg = '';
        }
        return output;
    }


}
