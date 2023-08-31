/**
 * 外幣存款轉帳提示語/警語視窗
 * 原 F1000104.MSG_F5000104_1_URL 內容
 * http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000104_1.html
 * https://mbbank.tcb-bank.com.tw/NMobileBank/AppView/msg/F5000104_1.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class ForexToForexInfo extends InfomationOptions {
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        this.title = '辦理人民幣業務風險告知';
        this.btnTitle = 'BTN.CHECK'; // 確定
        this.doubleButton = true;
        this.btnCancleTitle = 'BTN.MORE';
        this.linkList = {
            'more': 'https://www.tcb-bank.com.tw/PublishingImages/102CNY.jpg'
        };

        let content_html = [];
        content_html.push('<ol class="order_list"><li>本交易營業時間：星期一至星期五 (例假日除外) 上午九時十分至下午三時三十分。</li>');
        content_html.push('<li>本轉帳交易性質若為不同客戶間外幣轉帳，適用其交易性質細分類為：A不同客戶間轉讓（包括還款、捐贈、借款、投資）。</li>');
        content_html.push('<li>單日外匯存款轉帳交易金額未達等值美金30元者，以10次為限。</li>');
        content_html.push('<li>不同幣別轉換之計算方式:「轉換前幣別金額ｘ轉換前幣別對新台幣之牌告即期買入匯率／轉換後幣別對新台幣之牌告即期賣出匯率＝轉換後幣別金額」。</li>');
        // tslint:disable-next-line:max-line-length
        content_html.push('<li>自然人人民幣與其他幣別轉換每日累計轉出/轉入限額各CNY20,000(含臨櫃)。</li></ol>');
        this.content = content_html.join('');
    }

}

