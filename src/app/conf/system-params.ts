/**
 * 系統參數設定檔
 * 部分取代 f1000103 系統參數設定檔
 * 提供部分功能透過local設定檔顯示
 * custServiceTel	客服專線 => tel.ts
 * 連結: 請參閱external-web.ts
 * 部分說明事項請參閱 terms/
    verRemind	版號柔性提醒 => 維持f1000103
    NTD_CD_FLAG	台幣綜定存業務開放註記
    FRGNEX_TRNS_FLAG	外匯轉帳業務開放註記
    FRGNEX_CD_FLAG	外匯綜定存業務開放註記
    NTUH_TRNS_FLAG	台大醫療繳費業務開放註記
    FUND_TRNS_FLAG	基金業務開放註記
    cPayDay	國內標的小額每月扣款日
    fPayDay	國外標的小額每月扣款日
    maxPayDate	小額每月最多扣款日
    JB_CHECK_FLAG	開啟JB檢核註記
    VIRUS_CHECK_FLAG	開啟病毒檢核註記
 */

import { environment } from 'environments/environment';

let output_data = {
    // -------------------- [系統] -------------------- //
    // JB_CHECK_FLAG: 'Y', // 開啟JB檢核註記
    // VIRUS_CHECK_FLAG: 'Y', // 開啟病毒檢核註記
    // -------------------- [系統 End] -------------------- //
    // -------------------- [存款查詢] -------------------- //
    // NTD_CD_FLAG: 'Y', // 台幣綜定存業務開放註記
    // FRGNEX_TRNS_FLAG: 'Y', // 外匯轉帳業務開放註記
    // FRGNEX_CD_FLAG: 'Y', // 外匯綜定存業務開放註記
    GOLD: 'N', // 黃金存摺業務
    // -------------------- [存款查詢 End] -------------------- //
    // -------------------- [投資理財] -------------------- //
    // -------------------- [投資理財 End] -------------------- //
    // FUND_TRNS_FLAG: 'Y', // 基金業務開放註記
    NEW_FUND_TRNS_FLAG: 'N' // 新基金主機
    // cPayDay: '6,16,26', // 國內標的小額每月扣款日
    // fPayDay: '8,18,28', // 國外標的小額每月扣款日
    // maxPayDate: '5', // 小額每月最多扣款日
    // ======================================== 特殊專區 ======================================== //
    // -------------------- [醫療服務&產壽險服務] -------------------- //
    // NTUH_TRNS_FLAG: 'Y', // 台大醫療繳費業務開放註記
    // -------------------- [醫療服務&產壽險服務 End] -------------------- //
};

if (!environment.PRODUCTION) {
    // 測試版修正(開發模式)
    output_data['GOLD'] = 'Y';
    output_data['NEW_FUND_TRNS_FLAG'] = 'Y';
}


export const SYSTEM_PARAMS = output_data;
