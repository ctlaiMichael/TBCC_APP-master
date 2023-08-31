/**
 * 原 F1000103.MSG_F6000301_1_URL 內容
 */
import { InfomationOptions } from '@base/popup/infomation-options';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInformation4 extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this.title = '「0145-景順歐洲指標增值基金歐元」基金通路報酬揭露資訊';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {

        this.content = `
            <p class="inner_content">
            一、 基金名稱 ：「0145-景順歐洲指標增值基金歐元」 二、 基金種類 ：股票型 三、 基金投資方針 ：請參閱本基金公開說明書【基金概況】 四、 基金型態 ：開放式基金 五、 基金投資地區 ：本基金投資國內外
             六、 計價幣別 ：新臺幣計價受益權單位為新臺幣；外幣計價受益權單位為美元
            七、 本次核准發行總面額：本基金首次核准淨發行總面額最高為新臺幣貳佰億元整，其中： (一)新臺幣計價受益權單位首次核准淨發行總面額最高為新臺幣壹佰億元整。 (二)外幣計價受益權單位首次核准淨發行總面額最高為新臺幣壹佰億元整。 八、
            本次核准發行受益權單位數：本基金首次核准淨發行受益權單位總數，其中： (一)新臺幣計價受益權單位首次核准淨發行受益權單位總數最高為壹拾億個單位。 (二)外幣計價受益權單位首次核准淨發行受益權單位總數最高為等值基準受益權單位數 壹拾億個單位。
            九、 證券投資信託事業名稱：富蘭克林華美證券投資信託股份有限公司
            </p>
        `;
    }

}
