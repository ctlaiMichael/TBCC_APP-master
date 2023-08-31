export class ConfirmDualContentOptions {
    title?: string;     // 自定標題
    titleSecond?: string; // 第二段內容標題
    btnYesTitle?: string;  // 自定按鈕名稱
    btnNoTitle?: string;  // 自定按鈕名稱
    contentParam?: any;
    contentParamSecond?: any; // 第二段內容參數

    constructor() {
        this.title = 'POPUP.CONFIRM.TITLE';
        this.btnYesTitle = 'POPUP.CONFIRM.OK_BTN';
        this.btnNoTitle = 'POPUP.CONFIRM.CANCEL_BTN';
    }
}
