/**
 * 登入後無法更新之資訊(目前必須透過重新登入，才能取得的資訊)
 * 或是其他使用這資訊暫存(如執行某些步驟時，只有第一次狀態才進行，登出後全還原)
 */
export class TmpUserInfo {
    BoundID?: string;
    BIND_identity?: string; // OTP綁定識別碼暫存
    OtpCustInfo?: any; // OTP申請與異動資料暫存
    otp_modifytimes?: number; // OTP異動次數
    // --- 基金 --- //
    fundAllow?: string; // 基金功能使用權限(無信託帳號不允許使用基金功能)
    fundAgreeFlag?: string; // 基金換約註記, 1表示已換約
    isfundIncomeNotified?: string; // 紀錄停損停利是否在登入後已經通知過了, 1表示已通知

    constructor() {
        this.BoundID = '';
        this.BIND_identity = '';
        this.otp_modifytimes = 0;
        // --- OTP申請與異動資料暫存 --- //
        this.OtpCustInfo = {
            PhoneNo: '',
            Email: ''
        };
        // --- 基金 --- //
        this.fundAllow = '';
        this.fundAgreeFlag = '';
        this.isfundIncomeNotified = '';
    }
}
