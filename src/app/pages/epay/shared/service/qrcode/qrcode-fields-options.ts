/**
 * QR Code 準備傳送資訊
 * [type]:[subtype] 主類別: 子類別
 *      TWQRP: TWQRP1, TWQRP2
 *      EMV: EMV
 */
import { ScanErrorOptions } from '@base/options/scan-error-options';
export class QrcodeFieldsOptions {
    status: boolean; // 狀態
    msg_code?: string; // 錯誤代碼
    msg?: string; // 錯誤訊息
    data?: any; // 結果
    PayType: string; // 類別
    error_data?: ScanErrorOptions;
    response?: any; // api response
    checkRes?: any;

    constructor() {
        this.status = false;
        this.msg_code = '';
        this.msg = '';
        this.PayType = '';
        this.data = {};
        this.error_data = new ScanErrorOptions();
    }
}
