/**
 * 贖回轉換約定帳號查詢
 * 1: 贖回
 * 2: 贖回(預約)
 * 3: 轉換(一轉一)
 * 4: 轉換(一轉三)
 * 5: 轉換(一轉一) (預約)
 */
import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000502ReqBody extends ReqBody {
    custId = '';
    trnsType = '';
    currency = '';
    constructor() {
        super();
    }
}
