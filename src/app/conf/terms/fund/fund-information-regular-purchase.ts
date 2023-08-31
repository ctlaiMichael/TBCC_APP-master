/**
 * 顯示 定期(不)定額申購說明 popup
 * AppView/msg/FUND03.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInformationRegularPurchase extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    constructor() {
        super();
        this.title = '定期(不)定額申購說明';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {
        const data_list1 = [
            { currency: '新臺幣NTD', amount: '3,000元', unit: '1,000元' }
            , { currency: '美金USD', amount: '100元', unit: '100元' }
            , { currency: '澳幣AUD', amount: '100元', unit: '100元' }
            , { currency: '加幣CAD', amount: '100元', unit: '100元' }
            , { currency: '瑞郎CHF', amount: '100元', unit: '100元' }
            , { currency: '歐元EUR', amount: '100元', unit: '100元' }
            , { currency: '英鎊GBP', amount: '100元', unit: '100元' }
            , { currency: '港幣HKD', amount: '1,000元', unit: '1,000元' }
            , { currency: '日幣JPY', amount: '10,000元', unit: '10,000元' }
            , { currency: '瑞典幣SEK', amount: '1,000元', unit: '1,000元' }
            , { currency: '人民幣CNY', amount: '1,000元', unit: '1,000元' }
            , { currency: '南非幣ZAR', amount: '1,000元', unit: '1,000元' }
            , { currency: '紐西蘭幣NZD', amount: '100元', unit: '100元' }
            , { currency: '新加坡幣SGD', amount: '100元', unit: '100元' }
        ];

        let showList_html1 = [];
        data_list1.forEach(item => {
            let tmp_html = '<div class="table_chbox_row spot">';
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
            { currency: '新臺幣NTD', amount: '5,000元', unit: '1,000元', adjustAmount: '3,000元' }
            , { currency: '美金USD', amount: '300元', unit: '100元', adjustAmount: '200元' }
            , { currency: '澳幣AUD', amount: '300元', unit: '100元', adjustAmount: '200元' }
            , { currency: '加幣CAD', amount: '300元', unit: '100元', adjustAmount: '200元' }
            , { currency: '瑞郎CHF', amount: '300元', unit: '100元', adjustAmount: '200元' }
            , { currency: '歐元EUR', amount: '300元', unit: '100元', adjustAmount: '200元' }
            , { currency: '英鎊GBP', amount: '300元', unit: '100元', adjustAmount: '200元' }
            , { currency: '港幣HKD', amount: '3,000元', unit: '1,000元', adjustAmount: '2,000元' }
            , { currency: '日幣JPY', amount: '30,000元', unit: '10,000元', adjustAmount: '20,000元' }
            , { currency: '瑞典幣SEK', amount: '3,000元', unit: '1,000元', adjustAmount: '2,000元' }
            , { currency: '人民幣CNY', amount: '3,000元', unit: '1,000元', adjustAmount: '2,000元' }
            , { currency: '南非幣ZAR', amount: '3,000元', unit: '1,000元', adjustAmount: '2,000元' }
            , { currency: '紐西蘭幣NZD', amount: '300元', unit: '100元', adjustAmount: '200元' }
            , { currency: '新加坡幣SGD', amount: '300元', unit: '100元', adjustAmount: '200元' }
        ];

        let showList_html2 = [];
        data_list2.forEach(item => {
            let tmp_html = '<div class="table_chbox_row spot">';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.currency + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.amount + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.unit + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.adjustAmount + '</div>';
            tmp_html += '</div>';
            showList_html2.push(tmp_html);
        });

        const data_list3 = [
            { rank: 'RR1', level: '低', descript: '以追求穩定收益為目標，通常投資於短期貨幣市場工具，如：短期票券、銀行定存，但並不保證本金不會虧損。' }
            // tslint:disable-next-line:max-line-length
            , { rank: 'RR2', level: '中', descript: '以追求穩定收益為目標，通常投資於已開發國家政府公債、或國際專業評等機構評鑑為投資級（如標準普爾評等BBB級，穆迪評等Baa級以上）之已開發國家公司債券，但也有價格下跌之風險。' }
            , { rank: 'RR3', level: '中高', descript: '以追求兼顧資本利得及固定收益為目標，通常同時投資股票及債券、或投資於較高收益之有價證券，但也有價格下跌之風險。' }
            , { rank: 'RR4', level: '高', descript: '以追求資本利得為目標，通常投資於已開發國家股市、或價格波動相對較穩定之區域內多國股市，但可能有大幅價格下跌之風險。' }
            , { rank: 'RR5', level: '很高', descript: '以追求最大資本利得為目標，通常投資於積極成長型類股或波動風險轉大之股市，但可能有非常大之價格下跌風險。' }
        ];

        let showList_html3 = [];
        data_list3.forEach(item => {
            let tmp_html = '<div class="table_chbox_row spot">';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.rank + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.level + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.descript + '</div>';
            tmp_html += '</div>';
            showList_html3.push(tmp_html);
        });

        let content_html1 = [];
        content_html1.push('1. 定期定額「（基準）扣款幣別/金額」如下表');

        let content_html2 = [];
        content_html2.push('定期不定額「（基準）扣款幣別/金額」如下表');

        let content_html3 = [];
        content_html3.push('但本行、基金公司或信託投資標的對申購最低金額，另有規定者，從其所定。');
        content_html3.push('2. 最低申購手續費：新臺幣50元(或等值外幣)，對帳單寄送方式申請電子郵件(email)優惠不受最低收費50元之限制。');
        content_html3.push('3. 「約定扣款帳號」僅可選擇已約定網銀轉出之存款帳號。');
        content_html3.push('4. 部份境外基金（如JF、德盛德利系列）受理申購時非採當日單一淨值計算（雙向報價、次一營業日淨值計價），詳請詳閱各基金公開說明書及投資人須知：德盛德利系列基金之申購價=基金淨值*（1+0.5%），其中0.5%為基金公司收取之手續費。');
        content_html3.push('5. 定期(不)定額申購時間至每一營業日下午3：30，超過時間者除特殊事件或另有約定外，視為次日申請。');
        content_html3.push('6. 商品風險收益等級(RR1~RR5)說明：');

        let bottom_html = [];
        bottom_html.push('※本項風險收益等級僅供參考，投資共同基金之盈虧尚受到國際金融情勢震盪和匯兌風險影響。投資人宜斟酌個人風險承擔能力及資金可運用期間之長短後投資。');

        this.content = `
            <p class="inner_content">
            ` + content_html1.join('<br>') + `
            </p>
            <div class="table_chbox_frame">
                <div class="table_chbox_row">
                    <div class="table_chbox_th">幣別</div>
                    <div class="table_chbox_th">最低申請金額</div>
                    <div class="table_chbox_th">增加單位</div>
                </div>
                ` + showList_html1.join('') + `
            </div>
            <p class="inner_content">
            ` + content_html2.join('<br>') + `
            </p>
            <div class="table_chbox_frame">
                <div class="table_chbox_row">
                    <div class="table_chbox_th">幣別</div>
                    <div class="table_chbox_th">最低申請金額</div>
                    <div class="table_chbox_th">增加單位</div>
                    <div class="table_chbox_th">加減碼後最低扣款金額</div>
                </div>
                ` + showList_html2.join('') + `
            </div>
            <p class="inner_content">
            ` + content_html3.join('<br>') + `
            </p>
            <div class="table_chbox_frame">
                <div class="table_chbox_row">
                    <div class="table_chbox_th">風險收益等級</div>
                    <div class="table_chbox_th">投資風險</div>
                    <div class="table_chbox_th">投資目標</div>
                </div>
                ` + showList_html3.join('') + `
            </div>
            <p class="inner_content">
            ` + bottom_html.join('<br>') + `
            </p>
        `;
    }

}
