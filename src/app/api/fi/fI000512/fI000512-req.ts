import { ReqBody } from '@base/api/model/req-body';

export class FI000512ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = '';
    investType = '';
    currency = '';
    inCurrency = '';
    amount = '';
    unit = '';
    outAmount1 = '';
    outAmount2 = '';
    outAmount3 = '';
    outUnit1 = '';
    outUnit2 = '';
    outUnit3 = '';
    enrollDate = '';
    effectDate = '';
    payAccount = '';
    redeemType = '';
    inFundCode1 = '';
    inFundCode2 = '';
    inFundCode3 = '';
    bankSrvFee1 = '';
    bankSrvFee2 = '';
    bankSrvFee3 = '';
    fndComSrvFee1 = '';
    fndComSrvFee2 = '';
    fndComSrvFee3 = '';
    trnsToken = '';
    branchName = '';
    unitCall = '';
    constructor() {
        super();
    }
}
