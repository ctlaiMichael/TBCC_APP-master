import { ReqBody } from '@base/api/model/req-body';

export class FI000406ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    fundCode = '';
    fundType = '';
    amount = '';
    payAcnt = '';
    salesId = '';
    salesName = '';
    introId = '';
    introName = '';
    enrollDate = '';
    effectDate = '';
    currency = '';
    baseRate = '';
    favorRate = '';
    serviceFee = '';
    trnsToken = '';
    notiCD = '';
    sLossCD = '';
    sLoss = '';
    sProCD = '';
    sPro = '';
    branchName = '';
    unitCall = '';
    constructor() {
        super();
    }
}
