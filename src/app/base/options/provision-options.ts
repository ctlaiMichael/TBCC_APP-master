/**
 * Provision opton
 * 同意條款
 */
export class ProvisionOptions {
    title?: string;     // 自定標題
    sub_title?: string; // 子標題
    content?: string;  // 自定內容
    agree_msg?: string;  // 同意勾選文案
    agree_check?: string; // 同意勾選檢查文案
    btnTitle?: string;  // 自定按鈕名稱
    btnCancleTitle?: string;  // 自定取消按鈕名稱
    doubleButton?: boolean; // 是否有取消按鈕
    infoData?: Array<any>;
    linkList?: any; // 連結設定

    constructor() {
        this.title = '';
        this.sub_title = '';
        this.content = '';
        this.agree_msg = 'PG_OTP.SERVICE.INFO.AGREE'; // 本人同意上述合作金庫銀行「簡訊OTP服務」申請約定條款
        this.agree_check = 'ERROR.AGREE.AGREE_CHECK'; // 請先勾選同意事項。
        this.doubleButton = true;
        this.btnTitle = 'BTN.AGREE.AGREE_CONTENT'; // 瞭解並同意
        this.btnCancleTitle = 'BTN.AGREE.DISAGREE'; // 不同意
        this.linkList = {};
        this.infoData = [];
    }
}
