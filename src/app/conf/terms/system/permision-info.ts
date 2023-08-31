/**
 * APP啟動 合庫APP使用權限說明
 * 原：
 * tcb_dev_permision_url: http://210.200.4.11/MobileBank/AppView/msg/TCBDeclaration.html
 * tcb_production_permision_url: https://mbbank.tcb-bank.com.tw/NMobileBank/AppView/msg/TCBDeclaration.html
 */
import { InfomationOptions } from '@base/popup/infomation-options';
export class PermisionInfo extends InfomationOptions {
    constructor() {
        super();
        this._initData();
    }

    private _initData() {
        this.title = '合庫APP使用權限說明';
        this.btnTitle = '允許';
        this.btnCancleTitle = '拒絕';
        let content_html = [];
         // [20190508 需求單移除] 生活資訊
        content_html.push('1、位置:服務據點等服務需使用該權限。');
        content_html.push('2、相機:繳稅費卡款服務使用掃描條碼需使用該權限。');
        content_html.push('3、電話:撥打分行、客服及生活資訊等服務之電話需使用該權限。');
        content_html.push('4、行動數據:網路功能需使用該權限。');
        content_html.push('5、相片/多媒體/檔案:交易結果擷取螢幕畫面時需使用。');
        content_html.push('6、儲存空間:交易結果擷取螢幕畫面時需使用。');
        content_html.push('＊為提供完整的行動網銀服務，請您同意並授權本APP使用上述權限，若拒絕則本行無法提供您完整的合庫行動網銀服務，若您要關閉部分權限，可於Google Play商店或App Store「合作金庫銀行」詳閱完整說明。');
        this.content = content_html.join('\n');
    }

}
