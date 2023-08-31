/**
 * 處理HTTP連線狀態設定
 */

/**
 * HTTP Connect Error
 * (停機公告判斷之系統狀態)
 */
export const HTTP_SERVER_STOP_LIST = [
    // 防火牆屏蔽(可能防火牆關閉了)
    '401',
    '403',
    // 找不到對應路徑(IHS有接，但後面的掛了)
    '400',
    '404',
    '406',
    '410',
    // 伺服器無法連線
    '502',
    '504', // Gayway timeout
    // 伺服器錯誤
    '500'
];

export const HTTP_SERVER_TIMEOUT_LIST = [
    // 請求逾時
    '408'
];
