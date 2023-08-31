/**
 * 顯示 (預約)轉換說明 popup
 * AppView/msg/FUND08.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInformationReserve extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this.title = '(預約)轉換說明';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {
        const data_list = [
            { level: 'RR1', risk: '低', content: '以追求穩定收益為目標，通常投資於短期貨幣市場工具，如：短期票券、銀行定存，但並不保證本金不會虧損。' }
            // tslint:disable-next-line:max-line-length
            , { level: 'RR2', risk: '中', content: '以追求穩定收益為目標，通常投資於已開發國家政府公債、或國際專業評等機構評鑑為投資級（如標準普爾評等BBB級，穆迪評等Baa級以上）之已開發國家公司債券，但也有價格下跌之風險。' }
            , { level: 'RR3', risk: '中高', content: '以追求兼顧資本利得及固定收益為目標，通常同時投資股票及債券、或投資於較高收益之有價證券，但也有價格下跌之風險。' }
            , { level: 'RR4', risk: '高', content: '以追求資本利得為目標，通常投資於已開發國家股市、或價格波動相對較穩定之區域內多國股市，但可能有大幅價格下跌之風險。' }
            , { level: 'RR5', risk: '很高', content: '以追求最大資本利得為目標，通常投資於積極成長型類股或波動風險較大之股市，但可能有非常大之價格下跌風險。' }
        ];
        this.currency_list = data_list;

        let showList_html = [];
        data_list.forEach(item => {
            let tmp_html = '<div class="table_chbox_row">';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.level + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.risk + '</div>';
            tmp_html += '<div class="table_chbox_td" style="text-align:left">';
            tmp_html += item.content + '</div>';
            tmp_html += '</div>';
            showList_html.push(tmp_html);
        });

        let content_html = [];
        content_html.push('1. 轉換申請時間至每一營業日下午3:00，將轉為預約申請。');
        content_html.push('2. 國內基金轉換為贖回再申購方式，即轉出基金淨值計價日為T+1(贖回)，轉入基金淨值，計價日為轉出基金贖回款付款日當日，惟基金公司、各基金公開說明書就計價日另有規定者，從其規定。');
        content_html.push('3. 定期(不)定額扣款基金全部/部分轉換後，仍以原扣款基金為繼續扣款基金。');
        content_html.push('4. 商品風險收益等級(RR1~RR5)說明：');

        this.content = `
            <p class="inner_content">
            ` + content_html.join('<br>') + `
            </p>
            <div class="table_chbox_frame">
                <div class="table_chbox_row">
                    <div class="table_chbox_th ">風險收益等級</div>
                    <div class="table_chbox_th">投資風險</div>
                    <div class="table_chbox_th" style="text-align:center">投資目標</div>
                </div>
                ` + showList_html.join('') + `
            </div>
            <p class="inner_content">
                ※本項風險收益等級僅供參考，投資共同基金之盈虧尚受到國際金融情勢震盪和匯兌風險影響。投資人宜斟酌個人風險承擔能力及資金可運用期間之長短後投資。
            </p>
        `;
    }

}
