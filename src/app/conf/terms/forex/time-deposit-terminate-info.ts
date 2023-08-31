/**
 * 外匯綜定存中途解約提示語/警語視窗URL
 * 原 F1000104.MSG_F6000403_1_URL 內容
 * http://210.200.4.11/MobileBankDev_P4/AppView/msg/F6000403_1.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class TimeDepositTerminateInfo extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        
        this.title = '綜定存中途解約';
        this.btnTitle = 'BTN.CHECK'; // 確定
        this.linkList = {
            'more': 'https://www.tcb-bank.com.tw/PublishingImages/102CNY.jpg'
        };

        let content_html = [];
        content_html.push('<ol class="order_list"><li>本交易營業時間 : 星期一至星期五(例假日除外)上午九時至下午三時三十分。</li>');
        content_html.push('<li>中途解約存款期間未滿一個月者均不計息。</li>');
        content_html.push('<li>中途解約其存款期間滿一個月者，利息係按實際存滿期間，分別適用其存款當時本行一、三、六、九月之牌告利率八折計息。</li>');
        content_html.push('<li>解約利率=存款當時之實際存滿期間牌告利率 x 0.8</li>');
        content_html.push('<li>自然人持有免扣繳憑證，欲免預扣繳稅額者，請持該憑證冾臨櫃辨理。</li>');
        content_html.push('<li>預扣繳稅額係依預估匯率結算，倘輸入密碼後本行牌告異動時依最新牌告匯率重新計算(依稅法規定公司戶一律預扣稅額10%，自然人台幣毛息達20010元，應扣10%)。</li>');
        content_html.push('<li>若為「按月領息已領息超逾中途解約息」者，差額息由解約本金中扣回。</li></ol>');
        this.content = content_html.join('');
    }

}

