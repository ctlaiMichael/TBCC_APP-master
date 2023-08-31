import { ReqBody } from '@base/api/model/req-body';

export class FI000703ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = '';
    investAmntFlag = '';
    investAmnt = '';
    payDateFlag = '';
    payDate1 = '';
    payDate2 = '';
    payDate3 = '';
    payDate4 = '';
    payDate5 = '';
    payTypeFlag = '';
    changeBegin = '';
    changeEnd = '';
    payAcntStatus = '';
    payAcnt = '';
    profitAcntFlag = '';
    oriProfitAcnt = '';
    profitAcnt = '';
    effectDate = '';
    INCurrency = '';
    trnsToken = '';
    branchName = '';
    unitCall = '';
    payFundFlag = 'N';
    newFund = '';
    payDate31 = '';
    payDate5W = '';
    payEvaFlag = 'N';
    decline1Cd = '+';
    decline1 = '0';
    decline2Cd = '+';
    decline2 = '0';
    decline3Cd = '+';
    decline3 = '0';
    decline4Cd = '+';
    decline4 = '0';
    decline5Cd = '+';
    decline5 = '0';
    gain1Cd = '+';
    gain1 = '0';
    gain2Cd = '+';
    gain2 = '0';
    gain3Cd = '+';
    gain3 = '0';
    gain4Cd = '+';
    gain4 = '0';
    gain5Cd = '+';
    gain5 = '0';
    constructor() {
        super();
    }
}
