/**
 * 顯示 贖回限制說明 popup
 * AppView/msg/FUND03.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInformationRedeemRestrict extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    constructor() {
        super();
        this.title = '贖回的限制';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {
        const data_list1 = [
            { currency: '美金USD', balance: '300元', apply: '100元', unit: '100元' }
            , { currency: '歐元EUR', balance: '300元', apply: '100元', unit: '100元' }
            , { currency: '英鎊GBP', balance: '300元', apply: '100元', unit: '100元' }
            , { currency: '澳幣AUD', balance: '300元', apply: '100元', unit: '100元' }
            , { currency: '新加坡幣SGD', balance: '100元', apply: '100元', unit: '100元' }
            , { currency: '瑞土法郎CHF', balance: '100元', apply: '100元', unit: '100元' }
            , { currency: '加拿大幣CAD', balance: '100元', apply: '100元', unit: '100元' }
            , { currency: '港幣HKD', balance: '3,000元', apply: '1,000元', unit: '1,000元' }
            , { currency: '瑞典克朗SEK', balance: '3,000元', apply: '1,000元', unit: '1,000元' }
            , { currency: '日圓JPY', balance: '30,000元', apply: '10,000元', unit: '10,000元' }
            , { currency: '人民幣CNY', balance: '3,000元', apply: '1,000元', unit: '1,000元' }
            , { currency: '南非幣ZAR', balance: '3,000元', apply: '1,000元', unit: '1,000元' }
            , { currency: '紐西蘭幣NZD', balance: '300元', apply: '100元', unit: '100元' }
        ];

        let showList_html1 = [];
        data_list1.forEach(item => {
            let tmp_html = '<div class="table_chbox_row spot">';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.currency + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.balance + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.apply + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.unit + '</div>';
            tmp_html += '</div>';
            showList_html1.push(tmp_html);
        });

        let content_html1 = [];
        content_html1.push('一、贖回說明：');
        content_html1.push('需於受益權單位分配完成後始可辦理。定期定額扣款基金全部贖回後，除另有約定外，視為委託人終止該筆委託投資，本行嗣後不再繼續扣款。');
        content_html1.push('（二）部分贖回：');
        content_html1.push('定期定額投資部分贖回後，仍以原扣款基金繼續扣款投資。以申請日所持有單位數之信託金額辦理部分贖回，但該交易編號下基金部分贖回後贖回之基金剩餘信託金額需符合下列規定');
        content_html1.push('1. 新台幣信託：不得低於新台幣 1 萬元，以新台幣萬元為贖回申請單位，但國內債券型基金贖回剩餘金額不得低於新台幣 10 萬元。');
        content_html1.push('2. 外幣信託：贖回之基金剩餘信託金額，部分贖回申請金額/增加單位如下：');

        let bottom_html = [];
        bottom_html.push('但本行、基金公司或信託投資標的對贖回金額另有規定者，從其所定。');
        bottom_html.push('二、信託管理費收取方式：國外基金每次每筆最低為新台幣500元（等值外幣）；國內基金除國內債券型基金暫不收取外，餘每次每筆最低為新台幣 200 元。但本行對信託管理費最低金額另有規定者，從其所定。');

        this.content = `
            <p class="inner_content">
            ` + content_html1.join('<br>') + `
            </p>
            <div class="table_chbox_frame">
                <div class="table_chbox_row">
                    <div class="table_chbox_th"><i>幣別</i></div>
                    <div class="table_chbox_th"><i>贖回剩餘金額</i></div>
                    <div class="table_chbox_th"><i>贖回申請金額</i></div>
                    <div class="table_chbox_th"><i>增加單位</i></div>
                </div>
                ` + showList_html1.join('') + `
            </div>

            <p class="inner_content">
            ` + bottom_html.join('<br>') + `
            </p>
        `;
    }

}
