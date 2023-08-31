import { ReqBody } from '@base/api/model/req-body';

export class FI000511ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = '';
    investType = '';
    inCurrency = '';
    amount = '';
    unit = '';
    payAcnt = '';
    redeemType = '';
    inFundCode1 = '';
    inFundCode2 = '';
    inFundCode3 = '';
    transAmount1 = '';
    transAmount2 = '';
    transAmount3 = '';
    constructor() {
        super();
    }
}
