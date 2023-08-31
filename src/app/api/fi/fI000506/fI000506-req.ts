import { ReqBody } from '@base/api/model/req-body';

export class FI000506ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = '';
    investType = '';
    currency = '';
    inCurrency = '';
    amount = '';
    unit = '';
    redeemAmnt = '';
    enrollDate = '';
    effectDate = '';
    redeemAcnt = '';
    redeemType = '';
    redeemUnit = '';
    trustFee = '';
    isContinue = '';
    trnsToken = '';
    CDSCrate = '';
    branchName = '';
    unitCall = '';
    constructor() {
        super();
    }
}
