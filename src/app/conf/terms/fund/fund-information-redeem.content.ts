/**
 * 顯示 贖回說明 popup
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class FundInformationRedeemContent extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定內容
    constructor() {
        super();
        this.title = '贖回說明';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {
        this.content = `
            <p class="inner_content">
                注意事項：
                <br> 1.舊信託帳戶客戶(持實體憑證)請臨櫃辦理「贖回」申請並繳回 / 掛失 「信託憑證」。
                <br> 2.若該筆交易編號有部份贖回情形，累計配息將依贖回投資金額等比例調整，以延續原有報酬率。
                <br> 3.贖回申請時間至每一營業日下午3:00，超過時間者除特殊事件或另有約定外，視為次日申請。
                <br> 4.定期定額 /定期不定額之交易編號申請全部贖回、「全部贖回本筆契約是否終止」選擇否，將視為終止投資，嗣後將無法恢復投資。
                <br> 5.「贖回款存入帳號」僅可選擇已約定網銀轉出之存款帳號。
            </p>
        `;
    }

}
