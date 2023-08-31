/**
 * 簡訊密碼驗證
 * custId  身分證字號
 * verifyCode  驗證碼
 */
import { ReqBody } from '@base/api/model/req-body';

export class FC001010ReqBody extends ReqBody {
    custId = '';
    verifyWeb = ''; 
    verifyCode = '';  
    constructor() {
        super();
    }
}
