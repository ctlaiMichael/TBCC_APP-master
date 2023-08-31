export class PatternOptions {
    title?: string;     // 自定標題
    inputName?: string; // 憑證保護密碼
    transAccountType?: string; //  1約 2非約
    noteTitle?: string; // 提醒您
    noteContent?: string; // 提醒事項
    btnYesTitle?: string;  // 自定按鈕名稱
    btnNoTitle?: string;  // 自定按鈕名稱
    check?: boolean;
    showCaptcha?: boolean;
    constructor() {
        this.title = '交易作業';
        this.inputName = '圖形密碼';
        this.noteTitle = '提醒您';
        this.noteContent = '';
        this.transAccountType = '1';
        this.btnYesTitle = 'POPUP.CONFIRM.OK_BTN';
        this.btnNoTitle = 'POPUP.CONFIRM.CANCEL_BTN';
        this.showCaptcha = false;
        this.check = false;
    }
}
