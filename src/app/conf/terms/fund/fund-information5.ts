/**
 * 原 F1000103.MSG_F6000301_1_URL 內容
 */
import { InfomationOptions } from '@base/popup/infomation-options';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInformation5 extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this.title = '以投資高收益債券為訴求之證券投資信託基金、境外基金風險預告書';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {

        this.content = `
            <p class="inner_content">
            台端於決定投資前，應充分瞭解下列以投資高收益債券為訴求之基金之特有風險：<br>
            一、	信用風險：由於高收益債券之信用評等未達投資等級或未經信用評等，可能面臨債券發行機構違約不支付本金、利息或破產之風險。<br>
            二、	利率風險：由於債券易受利率之變動而影響其價格，故可能因利率上升導致債券價格下跌，而蒙受虧損之風險，高收益債亦然。<br>
            三、	流動性風險：高收益債券可能因市場交易不活絡而造成流動性下降，而有無法在短期內依合理價格出售的風險。<br>
            四、	投資人投資以高收益債券為訴求之基金不宜占其投資組合過高之比重，且不適合無法承擔相關風險之投資人。<br>
            五、	若高收益債券基金為配息型，基金的配息可能由基金的收益或本金中支付。任何涉及由本金支出的部份，可能導致原始投資金額減損。本基金進行配息前未先扣除行政管理相關費用。<br>
            六、	高收益債券基金可能投資美國144A債券（境內基金投資比例最高可達基金總資產10%；境外基金不限），該債券屬私募性質，易發生流動性不足，財務訊息揭露不完整或價格不透明導致高波動性之風險。<br>
            <b>本人（投資人）對上述相關風險已充分瞭解，特此聲明。</b><br>
            <b>本聲明書同時適用嗣後本人於本類基金之所有投資。</b><br>
            </p>
        `;
    }

}
