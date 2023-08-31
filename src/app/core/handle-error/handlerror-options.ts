export class HandleErrorOptions {
    type?: string; // 模式 錯誤訊息頁面(message) 導轉到某一頁(redirect) popup(dialog)
    title?: string; // 標題
    content?: string; // 錯誤訊息
    button?: string; // 確認
    buttonList?: Array<any>; // 自定義按鈕字樣
    backType?: string; // type = redirect 啟用: '0'= 回首頁 '1'= 返回上一頁 'route/path'= 直接連接到各頁面
    classType?: string; // 訊息提示類型success, warning, error
    resultCode?: string; // 錯誤代碼
    resultData?: any; // 原始資料
    from_page?: any; // 來源頁面
    dataTime?: any; // 查詢時間

    // 結果頁追加參數
    header_title?: string; // header title 改變
    title_params?: any = {}; // 副標題i18n參數
    content_params?: any = {}; // 訊息i18n參數
    buttonPath?: string; // 按鈕返回頁面
    mainInfo?: Array<any>; // 黃色區塊 [{title: '標題', content: '值'}]
    detailData?: Array<any>; // 雙欄位（一左一右）資訊 [{title: '標題', content: '值'}]
    notice?: string; // 提醒您區塊
    leftBtnIcon?: string; // 左側選單

    constructor(content: string = 'ERROR.DEFAULT', title: string = 'POPUP.ALERT.TITLE') {
        this.type = 'dialog';
        this.content = content;
        this.title = title;
        this.button = 'POPUP.ALERT.OK_BTN';
        // this.button = 'BTN.RETURN_HOME'; // 返回首頁
        // this.buttonPath = 'home';
        this.classType = 'error';
        this.title_params = {};

        // 結果頁追加參數
        this.content_params = {};
        this.mainInfo = [];
        this.detailData = [];
        this.resultCode = '';
    }
}
