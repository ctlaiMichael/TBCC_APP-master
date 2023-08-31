/**
 * 台幣轉外幣提示語/警語視窗
 *
 * 無外幣轉入帳號
 *
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class NoAccountInfo extends InfomationOptions {
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        this.title = '訊息';
        this.btnTitle = 'BTN.CHECK'; // 確定
        this.doubleButton = true;
        this.btnCancleTitle = 'BTN.MORE';

        let content_html = [];
        content_html.push('您未申請約定轉出/轉入帳號，尚無法執行本項交易。欲約定轉出/轉入帳號，請洽本行營業單位辦理');

        this.content = content_html.join('<br>');
    }

}

