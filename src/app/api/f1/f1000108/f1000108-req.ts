/**
 * F1000108-OTP功能申請
 * (新增、修改、刪除)
 *      custId	身分證字號
 *      action	設定動作
 *      phone	手機號碼
 *      email	電子信箱
 */
import { ReqBody } from '@base/api/model/req-body';

export class F1000108ReqBody extends ReqBody {
    custId = ''; // 身分證字號
    action = ''; // 設定動作
    phone = ''; // 手機號碼
    email = ''; // 電子信箱

    constructor() {
        super();
    }
}

