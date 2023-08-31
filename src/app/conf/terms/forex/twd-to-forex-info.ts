/**
 * 台幣轉外幣提示語/警語視窗
 * 原 F1000103.MSG_F5000103_1_URL 內容
 * http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000103_1.html
 * https://mbbank.tcb-bank.com.tw/NMobileBank/AppView/msg/F5000103_1.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class TwdToForexInfo extends InfomationOptions {
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
        content_html.push('<ol class="order_list"><li>本交易營業時間: 星期一至星期五 (例假日除外) 上午九時十分至下午三時三十分。</li>');
        content_html.push('<li>每日累計結匯限額：結購/結售各TWD499999。</li>');
        content_html.push('<li>自然人人民幣每日累計結購/結售各限額CNY20,000。</li>');
        content_html.push('<li>本交易單筆金額需要為等值新台幣三千元(含)以上/累計次數每日限30筆。</li>');
        // tslint:disable-next-line:max-line-length
        content_html.push('<li>本筆交易幣別為USD、JPY、EUR、HKD、NZD、AUD、ZAR、CNY、GBP、SGD、CAD、CHF者，即可享有匯率優惠：依本行牌告即期匯率加減，USD 0.03、JPY 0.001、EUR 0.05、HKD 0.01、NZD 0.02、AUD 0.02、ZAR 0.01、CNY 0.01、GBP 0.05、SGD 0.02、CAD 0.02、CHF 0.01。</li>');
        content_html.push('<li>若因外匯市場匯價波動劇烈，造成網銀優惠承作匯率優於成本匯率時，將以成本匯率承作。</li>');
        content_html.push('<li>依中央銀行「外匯收支及交易申報辦法規定」申報義務人務請審慎據實申報，若申報義務人申報不實，依管理外匯條例規定將處新台幣三萬元以上六十萬元以下罰鍰。</li></ol>');
        this.content = content_html.join('');
    }

}

// 辦理人民幣業務風險告知
// ※ 本交易營業時間: 星期一至星期五 (例假日除外) 上午九時十分至下午三時三十分。
// ※ 每日累計結匯限額：結購/結售各TWD499999。
// ※ 自然人人民幣每日累計結購/結售各限額CNY20,000。
// ※ 本交易單筆金額需要為等值新台幣三千元(含)以上/累計次數每日限30筆。
// ※ 本筆交易幣別為USD、JPY、EUR、HKD、NZD、AUD、ZAR、CNY、GBP、SGD、CAD、CHF者，即可享有匯率優惠：依本行牌告即期匯率加減，USD 0.03、JPY 0.001、EUR 0.05、HKD 0.01、NZD 0.02、AUD 0.02、ZAR 0.01、CNY 0.01、GBP 0.05、SGD 0.02、CAD 0.02、CHF 0.01。
// ※ 若因外匯市場匯價波動劇烈，造成網銀優惠承作匯率優於成本匯率時，將以成本匯率承作。
// ※ 依中央銀行「外匯收支及交易申報辦法規定」申報義務人務請審慎據實申報，若申報義務人申報不實，依管理外匯條例規定將處新台幣三萬元以上六十萬元以下罰鍰。
