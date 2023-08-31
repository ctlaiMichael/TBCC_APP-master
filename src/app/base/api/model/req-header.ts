export class ReqHeader {
    rquId: string;					// 交易識別碼
    sessionId: string;				// 使用者登入session id,取自login
    mobileNo: string;				// 機碼 (手機號碼)
    ipAddress: string;				// IP位置,後面寫死了...
    locale: string;					// 地區,取自login
    appVersion: string;				// 應用程序版本,取自framework
    plainText: string;				// 簽章原文
    signature: string;				// 簽章值
    certSN: string;					// 簽章憑證序號
    cn: string;						// RA-API驗章時傳送CN
    SecurityType: string;			// 驗證模式
    SecurityPassword: string;		// 驗證密碼
    Acctoken: string;				// 驗證識別token
    osType: string;				// 系統別,取自deviceInfo

    constructor() {
        this.rquId = '';
        this.sessionId = '';
        this.mobileNo = '';
        this.ipAddress = '';
        this.locale = '';
        this.appVersion = '';
        this.plainText = '';
        this.signature = '';
        this.certSN = '';
        this.cn = '';
        this.SecurityType = '';
        this.SecurityPassword = '';
        this.Acctoken = '';
        this.osType = '';
    }
}
