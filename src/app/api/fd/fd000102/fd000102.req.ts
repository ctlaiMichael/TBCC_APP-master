import { ReqBody } from '@base/api/model/req-body';

export class FD000102ReqBody extends ReqBody {
    custId = '';    // 身分證字號
    certCN = '';    // 憑證CN
    signCSR = '';   // 簽章憑證請求資料
    encCSR = '';    // 加密憑證請求資料
    certAplyPswd = '';  // 憑證申請密碼
}

