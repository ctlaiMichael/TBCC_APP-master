/**
 * OTP 申請同意條款
 * 原：native OTPApplyProvision.html
 */
import { ProvisionOptions } from '@base/options/provision-options';
export class OtpApplyProvision extends ProvisionOptions {
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        this.title = 'OTP申請約定條款';
        // tslint:disable-next-line:max-line-length
        this.sub_title = `
        歡迎申請合作金庫銀行「簡訊OTP服務」，本行在您日後使用行動網銀進行電子轉帳或交易指示類功能時提供簡訊OTP安全機制，使交易更為便利!
        <br>提醒您，以下係您在使用本服務時應先瞭解的相關事項，請您務必詳細閱讀；
        <br>當您完成本服務申請時，即表示您已閱讀並了解本行「簡訊OTP服務」之權利與義務。
        <br>以下為申請及使用簡訊OTP服務應注意事項：
        `;
        this.content = `
        申請本服務需驗證您本人之本行網路銀行/行動網銀憑證，請先確認相關裝置是否已備妥。
        <br>若申請本行簡訊OTP服務時，使用之本行網路銀行/行動網銀憑證有未生效、暫禁、過期、註銷、遺失、鎖碼等異常事故，或其他狀態異常等情事時，則將無法申請本項服務。
        <br>申請本服務成功後，日後您於行動網銀上進行電子轉帳或交易指示類功能時，簡訊密碼會使用簡訊的方式傳送至您所設定的手機號碼。
        <br>您可隨時透過本行網路銀行/行動網銀異動本服務，惟您異動本服務時，亦須同時使用您本人之網路銀行/行動網銀憑證進行身分驗證。此外，您也可以透過本行各營業單位辦理異動本服務。
        <br>本行得隨時修改本項服務之相關規定，並同意本行將修改後之規定於本行官方網頁公告，以代通知。修改後若您仍繼續使用本服務時，則視為您已閱讀、了解並同意該等修改；如果您不同意修改後之規定，可申請終止使用本服務。
        <br>其他未盡事宜悉依 本行有關規定及一般銀行慣例辦理。
        `;
        this.infoData = [
            '如有疑問，請洽詢本行二十四小時服務專線：04-22273131。'
        ];
    }

}

