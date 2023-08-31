/**
 * 額度調整查詢
 * custId	身分證字號
 * 
 */
import { ReqBody } from '@base/api/model/req-body';

export class FC001005ReqBody extends ReqBody {
    custId = '';
    txNo = '';
    finProofReqr = '';
    finProof1 = '';
    constructor() {
        super();
    }
}
