/**
 * 額度調整查詢
 * custId	身分證字號
 * 
 */
import { ReqBody } from '@base/api/model/req-body';

export class FC001004ReqBody extends ReqBody {
    custId = '';
    cardAccount = '';
    applyType = '';
    applyDate = '';
    endDate = '';
    applyAmount = '';
    applyReason = '';
    cellPhone = '';
    cityPhone = '';
    constructor() {
        super();
    }
}
