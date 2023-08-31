import { ReqBody } from '@base/api/model/req-body';

export class FI000508ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = '';
    investType = '';
    currency = '';
    inCurrency = '';
    amount = '';
    unit = '';
    outAmount = '';
    outUnit = '';
    enrollDate = '';
    effectDate = '';
    payAccount = '';
    redeemType = '';
    inFundCode = '';
    bankSrvFee = '';
    fndComSrvFee = '';
    trnsToken = '';
    branchName = '';
    unitCall = '';
    constructor() {
        super();
    }
}
