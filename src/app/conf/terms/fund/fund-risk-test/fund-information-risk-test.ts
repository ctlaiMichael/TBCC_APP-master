/**
 *  popup
 */
import { InfomationOptions } from '@base/popup/infomation-options';

export class FundInformationRiskTest extends InfomationOptions {
    title?: string;     // 自定標題
    btnTitle?: string;  // 自定按鈕名稱
    content?: string;  // 自定按鈕名稱
    currency_list?= [];
    constructor() {
        super();
        this.title = '訊息';
        this.btnTitle = 'BTN.CHECK';
        this._initData();
    }

    private _initData() {

        this.content = `
            <p class="inner_content">
            請協助填寫答案
            </p>
        `;
    }

}
