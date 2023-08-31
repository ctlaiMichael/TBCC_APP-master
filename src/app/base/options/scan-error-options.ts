/**
 * 掃碼相關error option
 */
export class ScanErrorOptions {
    type?: string; // 模式 錯誤訊息頁面(message) 導轉到某一頁(redirect) popup(dialog)
    title?: string; // 標題
    msg?: string; // 錯誤訊息
    classType?: string; // 訊息提示類型success, warning, error
    resultCode?: string; // 錯誤代碼
    resultData?: any; // 原始資料
    cancelFlag?: boolean; // 取消
    gotoSetFlag?: boolean; // 前往設定
    constructor() {
        this.type = 'dialog';
        this.title = 'ERROR.TITLE';
        this.msg = 'ERROR.SCAN.SCAN'; // 掃描失敗
        this.classType = 'error';
        this.resultCode = '';
        this.cancelFlag = false;
        this.gotoSetFlag = false;
    }
}
