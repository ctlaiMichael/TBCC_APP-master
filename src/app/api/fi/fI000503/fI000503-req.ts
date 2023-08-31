import { ReqBody } from '@base/api/model/req-body';

export class FI000503ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = '';
    investType = '';
    inCurrency = '';
    amount = '';
    unit = '';
    redeemAmnt = '';
    redeemAcnt = '';
    redeemType = '';
    isContinue = '';
    constructor() {
        super();
    }
}
