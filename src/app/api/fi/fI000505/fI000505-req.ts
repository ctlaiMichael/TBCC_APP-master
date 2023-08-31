import { ReqBody } from '@base/api/model/req-body';

export class FI000505ReqBody extends ReqBody {
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
    bookDate = '';
    constructor() {
        super();
    }
}
