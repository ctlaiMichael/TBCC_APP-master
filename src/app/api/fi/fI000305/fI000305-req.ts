import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000305ReqBody extends ReqBody {
    custId = '';
    fundCode = '';
    enrollDate = '';
    inCurrency = '';
    invenAmountT = '';
    trustAcnt = '';
    transCode = '';
    constructor() {
        super();
    }
}
