/**
 * 產壽險腳
 * 原：
 * tcb_dev_permision_url: http://210.200.4.11/MobileBank/AppView/msg/TCBDeclaration.html
 * tcb_production_permision_url: https://mbbank.tcb-bank.com.tw/NMobileBank/AppView/msg/TCBDeclaration.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class CreditcardInfo extends InfomationOptions {
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        this.title = '提醒您';
        this.btnTitle = '同意';
        this.btnCancleTitle = '不同意';
        let content_html = [];
         // [20190508 需求單移除] 生活資訊
        content_html.push('1、您開始使用本服務即代表您同意利用合作金庫行動網銀APP(以下簡稱本通路)進行「旺旺友聯產險」查詢與繳費服務。');
        content_html.push('2、實際應繳款金額依查詢所得結果為主，透過本通路繳費應視您的信用卡額度為準，如應繳金額超過您信用卡額度建議使用其他通路繳費。');
        content_html.push('3、提醒您，透過本通路繳款每筆繳費毋需向您收取手續費。');
        content_html.push('4、如有任何「旺旺友聯產險」垂詢或費用之相關問題，請逕洽「旺旺友聯產險」客戶服務專線：0800-024-024。');
        content_html.push('5、如有本通路使用上之問題，請洽本行客戶服務專線：04-22273131。');
        this.content = content_html.join('\n');
    }

}
