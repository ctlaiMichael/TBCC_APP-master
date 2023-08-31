/**
 * Informate opton
 */
export class InfomationOptions {
    title?: string;     // 自定標題
    content?: string;  // 自定內容
    sub_title?: string;
    agree_msg?: string;
    agree_check?: string;
    btnTitle?: string;  // 自定按鈕名稱
    doubleButton?: boolean; // 是否有取消按鈕
    btnCancleTitle?: string;  // 自定取消按鈕名稱
    linkList?: any; // 連結設定
    infoData?: any;

    constructor() {
        this.title = '';
        this.content = '';
        this.sub_title = '';
        this.agree_msg = '';
        this.agree_check = '';
        this.btnTitle = 'BTN.CHECK';
        this.doubleButton = false;
        this.btnCancleTitle = 'BTN.CANCLE';
        this.linkList = {};
        this.infoData = [];
    }
}
