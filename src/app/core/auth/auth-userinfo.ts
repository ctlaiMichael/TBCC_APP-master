export class AuthUserInfo {
    type?: string;
    custId?: string;
    userId?: string;
    sessionId?: string;
    validateResult?: string;
    isMobileFlag?: string;
    warnMsg?: string;
    userCode?: string;
    cnEndDate?: string;
    BoundID?: string;
    SSLID?: number;
    OTPID?: string;
    DefAuthType?: string;
    AuthType?: string;
    CategorySecuritys?: object;
    OtpSttsInfo?: object;
    OtpCustInfo?: object;
    email?: string; // 更改綜合對帳單寄送方式後會複寫此欄位
    isTax?: string;
    isAAcct?: string;
    isNAAcct?: string;
    isOlnATrnsInAcct?: string;
    isElectApply?: string;
    refuseMarkingType?: string;
    cn?: string;
    serialNumber?: string;
    goldAcct?: string;
    lastUpdate?: number;
    pushGuid?: string;
}
