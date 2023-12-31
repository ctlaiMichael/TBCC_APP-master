/**
 * 原 https://www.tcb-bank.com.tw/product/trust/Pages/fundchanneldetail.aspx?p=6201 內容
 */
import { InfomationOptions } from '@base/popup/infomation-options';
import { FlagUtil } from '@shared/util/formate/view/flag-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
export class FundInformation2 extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this.title = '基金通路報酬資訊';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {

        this.content = `
            <p class="inner_content">
                基金通路報酬之揭露應符合下列原則： (1)依「基金別」揭露，但同一證券投資信託事業或境外基金機構及總代 理人，通路報酬費率相同之基金，得共用一份說明資料。 (2)報酬類型及揭露內容詳如附件範本格式。
                (3)申購手續費分成及經理費分成之揭露可為實際費率；或無條件進位至
                整數位，但不得高於最高手續費率／經理費率。 (4)贊助或提供產品說明會及員工教育訓練之揭露方式如下： 1.銷售時可確定金額：如係提供一筆贊助金者，雖無須分攤至個別基 金，但應揭露總金額。 2.銷售時無法確定金額：說明內容及計算方式。
                3.範圍：證券投資信託事業、總代理人或境外基金機構贊助或提供之 茶點費、講師費（不含證券投資信託事業、總代理人或境外基金機 構內部員工講師）、場地費（不含證券投資信託事業、總代理人、 境外基金機構或銷售機構之公司內部場地）、銷售機構員工參與教
                育訓練之交通費及住宿費等合理必要費用。 4.揭露門檻：贊助金額高於第五條第一項所定金額者，才須揭露。 (5)其他報酬之揭露方式：其他報酬金額高於第五條第三項所定金額者， 才須揭露。 (6)通路報酬揭露書面得以單張說明或併申購申請書或其他文件方式為之
                ；網路電子交易、語音或其他電子方式申購得以公司網路頁面、播放 或任何得使投資人了解之方式揭露。 (7)投資人須簽名或蓋章確認已閱讀及了解通路報酬揭露書面；如係透過 網路、語音或其他電子方式申購，
                投資人可提供身分證字號或出生年 月日或登入密碼等個人識別資訊以確認係本人，本人仍應透過網路頁
                面或口頭同意等方式確認知悉。又，就金融消費者保護法第四條所稱 專業投資機構及定時定額投資人，僅於首次申購時進行揭露通知，除 有第六條變動通知之情形外，銷售機構毋庸就後續投資進行通知。
                 (8)總代理人及基金銷售機構就投資人持有之基金別，應依下列方式之一
                ，揭露基金經理費率及其分成費率：1.定期以對帳單或其他相當文件 揭露；2.於公司網站揭露，並於對帳單提醒投資人在其持有期間，
                總 代理人或銷售機構仍持續收受經理費分成報酬，另如投資人所持有基 金之經理費率及其分成費率有變動情形，應描述變動之情形，並註明
                相關費率資訊之查詢網址與電話。 如銷售機構所屬客戶係與證券投資信託事業或總代理人簽訂開戶契約，且 對帳單亦由證券投資信託事業或總代理人寄送，
                證券投資信託事業及總代 理人應於對帳單提醒投資人在其持有期間，銷售機構仍持續收受經理費分 成報酬，另如投資人所持有基金之經理費率及其分成費率有變動情形，應
                描述變動之情形，並註明相關費率資訊之查詢電話，銷售機構則應於網站 揭露基金經理費率及其分成費率；上述銷售機構如未設立公司網站，得以 電話查詢經理費率及其分成費率方式取代網路揭露。
            </p>
        `;
    }

}
