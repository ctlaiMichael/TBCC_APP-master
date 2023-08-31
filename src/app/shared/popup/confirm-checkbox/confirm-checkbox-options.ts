export class ConfirmCheckBoxOptions {
    title?: string;     // 自定標題
    btnYesTitle?: string;  // 自定按鈕名稱
    btnNoTitle?: string;  // 自定按鈕名稱
    contentParam?: any;
    checkbox?:string;
    constructor() {
        this.title = 'POPUP.CONFIRM.TITLE';
        this.btnYesTitle = 'POPUP.CONFIRM.OK_BTN';
        this.btnNoTitle = 'POPUP.CONFIRM.CANCEL_BTN';
        this.checkbox='';
    }
}
