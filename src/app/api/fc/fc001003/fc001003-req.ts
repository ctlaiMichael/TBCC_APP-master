/**
 * 額度調整查詢
 * custId	身分證字號
 * 
 */
import { ReqBody } from '@base/api/model/req-body';

export class FC001003ReqBody extends ReqBody {
    custId = '';
    type = '';
    constructor() {
        super();
    }
}
