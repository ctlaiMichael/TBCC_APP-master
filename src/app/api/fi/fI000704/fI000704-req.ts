import { ReqBody } from '@base/api/model/req-body';

export class FI000704ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = '';
    amount = '';
    unit = '';
    oriProfitAcnt = '';
    profitAcnt = '';
    INCurrency = '';
    trnsToken = '';
    constructor() {
        super();
    }
}
