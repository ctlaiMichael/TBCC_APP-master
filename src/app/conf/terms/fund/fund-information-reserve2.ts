/**
 * 顯示 (預約)轉換說明 popup
 * AppView/msg/FUND09.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInformationReserve2 extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this.title = '(預約)轉換方式說明';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {
        const data_list = [
            { currency: '美金(USD)', icon: 'icon_usa', balance: '300元', convertAmt: '100元', diffUnit: '100元' }
            ,  { currency: '歐元(EUR)', icon: 'icon_eur', balance: '300元', convertAmt: '100元', diffUnit: '100元' }
            ,  { currency: '英鎊(GBP)', icon: 'icon_eng', balance: '300元', convertAmt: '100元', diffUnit: '100元' }
            ,  { currency: '澳幣(AUD)', icon: 'icon_aus', balance: '300元', convertAmt: '100元', diffUnit: '100元' }
            ,  { currency: '新加坡幣(SGD)', icon: 'icon_si', balance: '300元', convertAmt: '100元', diffUnit: '100元' }
            ,  { currency: '瑞士法郎(CHF)', icon: 'icon_swi', balance: '300元', convertAmt: '100元', diffUnit: '100元' }
            ,  { currency: '加拿大幣(CAD)', icon: 'icon_canada', balance: '300元', convertAmt: '100元', diffUnit: '100元' }
            ,  { currency: '港幣(HKD)', icon: 'icon_hk', balance: '3,000元', convertAmt: '1,000元', diffUnit: '1,000元' }
            ,  { currency: '瑞典克朗(SEK)', icon: 'icon_swe', balance: '3,000元', convertAmt: '1,000元', diffUnit: '1,000元' }
            ,  { currency: '日圓(JPY)', icon: 'icon_jpn', balance: '30,000元', convertAmt: '10,000元', diffUnit: '10,000元' }
            ,  { currency: '人民幣(CNY)', icon: 'icon_china', balance: '3,000元', convertAmt: '1,000元', diffUnit: '1,000元' }
        ];
        this.currency_list = data_list;

        let showList_html = [];
        data_list.forEach(item => {
            let tmp_html = '<div class="table_chbox_row">';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += '<i class="icon_currency ' + item.icon + '"></i>' + item.currency + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.balance + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.convertAmt + '</div>';
            tmp_html += '<div class="table_chbox_td">';
            tmp_html += item.diffUnit + '</div>';
            tmp_html += '</div>';
            showList_html.push(tmp_html);
        });

        let content_html = [];
        content_html.push('轉換之限制');
        content_html.push('一、轉換說明：');
        content_html.push('轉換分為全部轉換及部分轉換，但須屬於同一基金經理公司或集團所發行並為本行同意受理');
        content_html.push('轉換之基金為限，另新台幣信託與外幣信託間不得相互轉換，說明如下：');
        content_html.push('（一）全部轉換：需於受益權單位分配完成後始可辦理。');
        content_html.push('（二）部分轉換：限新信託契約帳戶下之交易編號始可申請辦理。以申請日所持有單位數之信託金額辦理部分轉換，每一交易編號下最多可轉換為4種不同基金，但該交易編號下基金部分轉換後，轉出之基金剩餘信託金額不得低於下列規定：');
        content_html.push('１、新台幣信託：轉出之基金剩餘信託金額不得低於新台幣1萬元，並以萬元為部份轉換申請/累增單位，但國內債券型基金轉出及轉換後剩餘信託金額不得低於新台幣10萬元。');
        content_html.push('２、外幣信託：轉出之基金剩餘信託金額，部分轉換申請金額/增加單位如下');

        let bottom_html = [];
        bottom_html.push('但本行、基金公司或信託投資標的對轉換金額另有規定者，從其所定。');
        bottom_html.push('二、轉換手續費：');
        bottom_html.push('（一）本行收取部份：國內基金每次每筆新台幣200元，境外基金每次每筆新台幣500元但本行對轉換手續費金額另有規定者，從其所定。');
        bottom_html.push('（二）基金公司收取部份：如基金公司另訂有外收轉換手續費標準者，本行將從其規定代為以新台幣收取。');

        this.content = `
            <p class="inner_content">
            ` + content_html.join('<br>') + `
            </p>
            <div class="table_chbox_frame">
                <div class="table_chbox_row">
                    <div class="table_chbox_th ">幣別</div>
                    <div class="table_chbox_th">轉出剩餘<br>金額</div>
                    <div class="table_chbox_th">轉換申請<br>金額</div>
                    <div class="table_chbox_th">增加<br>單位</div>
                </div>
                ` + showList_html.join('') + `
            </div>
            <p class="inner_content">
            ` + bottom_html.join('<br>') + `
            </p>
        `;
    }

}
