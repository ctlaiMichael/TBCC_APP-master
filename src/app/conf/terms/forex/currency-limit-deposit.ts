/**
 * 原 F1000103.MSG_F6000301_1_URL 內容
 */
import { InfomationOptions } from "@base/popup/infomation-options";
import { FlagUtil } from "@shared/util/formate/view/flag-util";
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class ForexCurrencyLimitDeposit extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this.title = '各幣別最低存款限制';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {
        const data_list = [
            { currency: 'USD', amount: '1000' }
            , { currency: 'HKD', amount: '7900' }
            , { currency: 'GBP', amount: '600' }
            , { currency: 'AUD', amount: '1300' }
            , { currency: 'SGD', amount: '1600' }
            , { currency: 'CHF', amount: '1200' }
            , { currency: 'CAD', amount: '1300' }
            , { currency: 'JPY', amount: '106000' }
            , { currency: 'SEK', amount: '7500' }
            , { currency: 'NZD', amount: '1400' }
            , { currency: 'EUR', amount: '2400' }
            , { currency: 'ZAR', amount: '7000' }
            , { currency: 'THB', amount: '40000' }
            , { currency: 'CNY', amount: '7000' }
        ];
        this.currency_list = data_list;

        let show_html = [];
        data_list.forEach(item => {
            let tmp_html = '<li class="table_row">';
            tmp_html += '<span>';
            tmp_html += item.currency + '(' + FlagUtil.transIconFlag(item.currency, 'chineseName') + ')';
            tmp_html += '</span>';
            tmp_html += '<i>';
            tmp_html += AmountUtil.amount(item.amount);
            tmp_html += '</i>';
            tmp_html += '</li>';
            show_html.push(tmp_html);
        });

        this.content = `
            <p class="inner_content">
            </p><ul class="table_info table_th_style">
                <li class="table_row">
                    <span>幣別</span>
                    <i>最低存款限額<br>(單位：元)</i>
                </li>
                ` + show_html.join('') + `
            </ul><p></p>
        `;
    }

};
