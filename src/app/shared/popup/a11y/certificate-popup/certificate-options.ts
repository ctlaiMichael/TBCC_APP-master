export class CertificateOptions {
    title?: string;     // 自定標題
    btnYesTitle?: string;  // 自定按鈕名稱
    btnNoTitle?: string;  // 自定按鈕名稱
    check?: boolean;
    constructor() {
        this.title = '您尚未下載憑證，請依「密碼通知書(憑證申請密碼)」輸入以下資訊';
        this.btnYesTitle = 'POPUP.CONFIRM.OK_BTN';
        this.btnNoTitle = 'POPUP.CONFIRM.CANCEL_BTN';
        this.check = false;
    }
}
