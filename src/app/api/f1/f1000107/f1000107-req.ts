/**
 * F1000107-OTP裝置認證
 * custId	身分證字號
 * OtpIdentity	OTP裝置認證識別碼 => 使用者自F1000106取得
 * commonName	好記名稱
 */
import { ReqBody } from '@base/api/model/req-body';

export class F1000107ReqBody extends ReqBody {
    custId = '';
    OtpIdentity = '';
    commonName = '';
    constructor() {
        super();
    }
}

