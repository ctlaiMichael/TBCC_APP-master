import { ReqBody } from '@base/api/model/req-body';

export class FI000507ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = '';
    investType = '';
    inCurrency = '';
    amount = '';
    unit = '';
    transAmount = '';
    payAcnt = '';
    redeemType = '';
    inFundCode = '';
    constructor() {
        super();
    }
}
