/**
 * F1000106-OTP裝置申請
 * custId	身分證字號
 * password	使用者密碼
 */
import { ReqBody } from '@base/api/model/req-body';

export class F1000106ReqBody extends ReqBody {
    custId = '';
    password = '';
    constructor() {
        super();
    }
}

