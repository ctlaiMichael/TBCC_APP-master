/**
 * 信用卡專區超商繳信卡費
 * custId	身分證字號
 * amount   金額
 */
import { ReqBody } from '@base/api/model/req-body';

export class FC000404ReqBody extends ReqBody {
    custId = '';
    amount = '';
    constructor() {
        super();
    }
}
