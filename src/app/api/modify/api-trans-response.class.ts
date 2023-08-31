/**
 * 參數設定
 * API Trans Response
 */
export class ApiTransResponse {
    status: boolean; // true 成功, false 失敗
    title: string; // 顯示結果標題
    classType?: string; // 訊息提示類型success, warning, error
    msg: string; // 回應訊息
    trnsRsltCode: string; // 回應代碼
    body?: any;
    header?: any;
    hostCode: string;
    hostCodeMsg: string;
    host_list: Array<any>;
    resultCode?: string; // 錯誤代碼
    dataTime?: string; // 時間


    constructor(
    ) {
        this.status = false;
        this.title = 'ERROR.TITLE'; // 交易失敗
        this.classType = 'error';
        this.msg = 'ERROR.DEFAULT';
        this.trnsRsltCode = '';
        this.body = {};
        this.header = {};
        this.host_list = [];
    }

}
