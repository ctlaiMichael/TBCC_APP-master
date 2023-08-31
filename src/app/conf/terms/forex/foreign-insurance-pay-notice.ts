/**
 * 外幣轉台幣提示語/警語視窗
 * 原 F1000103.MSG_F5000103_1_URL 內容
 * http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000103_1.html
 * https://mbbank.tcb-bank.com.tw/NMobileBank/AppView/msg/F5000103_1.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class ForeignInsurancePay extends InfomationOptions {
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        this.title = '注意事項';
        this.btnTitle = 'BTN.CHECK'; // 確定
        this.doubleButton = true;
        this.btnCancleTitle = 'BTN.MORE';
        this.linkList = {
            'more': 'https://www.tcb-bank.com.tw/PublishingImages/102CNY.jpg'
        };

        let content_html = [];

        content_html.push('<ol class="order_list"><li>本交易營業時間: 星期一至星期五 (例假日除外) 上午九時十分至下午三時三十分。</li>');
        content_html.push('<li>注意!!為保障您的權益,請謹慎操作,錯誤轉帳或銷帳後續問題之處理,請洽原人壽保險公司辦理,並告知所輸入之繳費資訊。</li>');
        content_html.push('<li>本轉帳交易申報匯款性質695Z:人身保險費。</li></ol>');
        this.content = content_html.join('');
    }

}
