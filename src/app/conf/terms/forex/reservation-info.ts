/**
 * 台幣轉外幣提示語/警語視窗
 *
 * 無外幣轉入帳號
 *
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class ReservationInfo extends InfomationOptions {
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        this.title = '已超過營業時間，系統將自動轉成預約交易';
        this.btnTitle = 'BTN.CHECK'; // 確定
        this.doubleButton = true;
        this.btnCancleTitle = 'BTN.MORE';

        let content_html = [];
        content_html.push('<ol class="order_list"><li>預約交易限次一營業日至六個月內。</li>');
        content_html.push('<li>預約交易不提供匯率優惠，實際成交匯率依預約轉帳日(約上午9:30)本行牌告賣匯為準。</li>');
        content_html.push('<li>預約交易完成不代表交易已成功，可能因扣款帳號存款不足、逾限額、臨時停上營業或電腦系統等因素致交易失敗，請務必於轉帳日上午10:00後，確認該筆交易扣款是否成功。</li>');
        this.content = content_html.join('');
    }

}

