/**
 * 簡訊密碼請求
 * custId	身分證字號
 * phone    手機號碼
 */
import { ReqBody } from '@base/api/model/req-body';

export class FC001009ReqBody extends ReqBody {
    custId = ''; 
    phone = '';  
    constructor() {
        super();
    }
}
