/**
 * 顯示 (預約)單筆申購說明 popup
 * AppView/msg/FUND02.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInformationSinglePurchase extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    constructor() {
        super();
        this.title = '(預約)單筆申購說明';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {
        const data_list1 = [
            { currency: '新台幣NTD',  amount: '3,000元', unit: '1,000元' }
            ,  { currency: '美金USD', amount: '100元', unit: '100元' }
            ,  { currency: '澳幣AUD', amount: '100元', unit: '100元' }
            ,  { currency: '加拿大幣CAD', amount: '100元', unit: '100元' }
            ,  { currency: '瑞土法郎CHF', amount: '100元', unit: '100元' }
            ,  { currency: '歐元EUR', amount: '100元', unit: '100元' }
            ,  { currency: '英鎊GBP', amount: '100元', unit: '100元' }
            ,  { currency: '港幣HKD', amount: '1,000元', unit: '1,000元' }
            ,  { currency: '日圓JPY', amount: '10,000元', unit: '10,000元' }
            ,  { currency: '瑞典克朗SEK', amount: '1,000元', unit: '1,000元' }
            ,  { currency: '人民幣CNY', amount: '1,000元', unit: '1,000元' }
            ,  { currency: '南非幣ZAR', amount: '1,000元', unit: '1,000元' }
            ,  { currency: '紐西蘭幣NZD', amount: '100元', unit: '100元' }
            ,  { currency: '新加坡幣SGD', amount: '100元', unit: '100元' }
        ];

        let showList_html1 = [];
        data_list1.forEach(item => {
            let tmp_html = '<div class="table_four_hl_tr spot">';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.currency + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.amount + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.unit + '</div>';
            tmp_html += '</div>';
            showList_html1.push(tmp_html);
        });

        const data_list2 = [
            { rank: 'RR1', level: '低', descript: '以追求穩定收益為目標，通常投資於短期貨幣市場工具，如：短期票券、銀行定存，但並不保證本金不會虧損。' }
            // tslint:disable-next-line:max-line-length
            , { rank: 'RR2', level: '中', descript: '以追求穩定收益為目標，通常投資於已開發國家政府公債、或國際專業評等機構評鑑為投資級（如標準普爾評等BBB級，穆迪評等Baa級以上）之已開發國家公司債券，但也有價格下跌之風險。' }
            , { rank: 'RR3', level: '中高', descript: '以追求兼顧資本利得及固定收益為目標，通常同時投資股票及債券、或投資於較高收益之有價證券，但也有價格下跌之風險。' }
            , { rank: 'RR4', level: '高', descript: '以追求資本利得為目標，通常投資於已開發國家股市、或價格波動相對較穩定之區域內多國股市，但可能有大幅價格下跌之風險。' }
            , { rank: 'RR5', level: '很高', descript: '以追求最大資本利得為目標，通常投資於積極成長型類股或波動風險較大之股市，但可能有非常大之價格下跌風險。' }
        ];

        let showList_html2 = [];
        data_list2.forEach(item => {
            let tmp_html = '<div class="table_four_hl_tr spot">';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.rank + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.level + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.descript + '</div>';
            tmp_html += '</div>';
            showList_html2.push(tmp_html);
        });

        let content_html1 = [];
        content_html1.push('1. 國內貨幣型基金、國內外後收型基金，因商品特殊性，僅限臨櫃申購，如欲申購前項商品，請至分行辦理。');
        content_html1.push('2. 當日單筆申購時間至每個營業日15：00，超過時間者將轉為預約申請。');
        content_html1.push('3. 商品風險收益等級(RR1~RR5)說明：');

        let content_html2 = [];
        content_html2.push('但本行、 基金公司或信託投資標的對申購最低金額，另有規定者，從其所定。');
        content_html2.push('4.網銀之外幣約定轉出帳號僅限於本行多幣別外匯活期或綜合存款帳戶(即帳號型態為XXXX-665-XXXXXX、XXX-188-XXXXXX)。');
        content_html2.push('5.當日單筆申購時間至每個營業日15：00，超過時間者將轉為預約申請。(※外幣信託預約交易時間為15：00至24：00)');
        content_html2.push('6.商品風險收益等級(RR1~RR5)說明：');

        let bottom_html = [];
        bottom_html.push('4. 最低信託金額請詳本行官方網站：國內基金業務、境外基金業務。但本行、基金公司及各基金公開說明書對個別基金申購最低金額另有規定者，從其所定。');

        this.content = `
            <p class="inner_content">
            ` + content_html1.join('<br>') + `
            </p>
            <div class="table_four_hl">
                <div class="table_chbox_row">
                    <div class="table_chbox_th ">
                        風險收益等級
                    </div>
                    <div class="table_chbox_th">投資風險</div>
                    <div class="table_chbox_th" style="text-align:center">投資目標</div>
                </div>
                ` + showList_html2.join('') + `
            </div>
            <p class="inner_content">
            ` + bottom_html.join('<br>') + `
            </p>
        `;
    }

}
