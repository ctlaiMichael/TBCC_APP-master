export class OtpOptions {
    title?: string;     // 自定標題
    content?: string; // OTP提醒內容
    btnYesTitle?: string;  // 自定按鈕名稱
    btnNoTitle?: string;  // 自定按鈕名稱
    check?: boolean;
    otpView?: boolean;
    reqData?: any;
    transAccountType?: string;
    showCaptcha?: boolean;
    ignorCheckInfo?: boolean; // 是否顯示OTP提示訊息
    constructor() {
        this.title = '您尚未下載憑證，請依「密碼通知書(憑證申請密碼)」輸入以下資訊';
        // this.content = '親愛的客戶請注意:本交易於按下「確定」鈕後，即進行OTP簡訊密碼發送，若中途取消或逾時未輸入密碼，均將視為「逾時未輸入OTP簡訊密碼」，經逾時未輸入或輸入密碼錯誤連續達5次時，本行得逕行暫停本服務，若須恢復使用，您可登入本行網路銀行利用憑證進行OTP解鎖交易，或至本行各營業單位臨櫃辦理OTP解鎖服務。是否繼續進行交易?';
        this.content = '<i class="font_red">輸入密碼錯誤連續達5次時，電腦即自動停止本服務</i>，若須恢復使用，您可登入本行網路銀行利用憑證進行OTP解鎖交易，或至本行各營業單位臨櫃辦理OTP解鎖服務。';
        this.btnYesTitle = 'POPUP.CONFIRM.OK_BTN';
        this.btnNoTitle = 'POPUP.CONFIRM.CANCEL_BTN';
        this.check = true;
        this.transAccountType = '2';
        this.showCaptcha = false;
        this.otpView = false;
        this.ignorCheckInfo = true; // 目前都不顯示提示訊息(2019/8/8 電金調整)
        this.reqData = {};
    }
}
