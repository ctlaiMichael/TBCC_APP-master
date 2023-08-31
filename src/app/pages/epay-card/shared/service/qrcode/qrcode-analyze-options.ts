/**
 * QR Code 分析資訊
 * [type]:[subtype] 主類別: 子類別
 *      TWQRP: TWQRP1, TWQRP2
 *      EMV: EMV
 */
import { ScanErrorOptions } from '@base/options/scan-error-options';
export class QrcodeAnalyzeOptions {
    status: boolean; // 分析狀態
    type?: string; // 主類別
    subtype?: string; // 子類別
    data?: any; // QR Code解析資料
    preCheckQrcode?: string; // decodeURI QR Code
    subtypeIndex?: number;
    errorData?: ScanErrorOptions;

    constructor() {
        this.status = false;
        this.type = '';
        this.subtype = '';
        this.data = '';
        this.preCheckQrcode = '';
        this.errorData = new ScanErrorOptions();
    }
}
