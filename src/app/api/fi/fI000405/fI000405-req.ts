import { ReqBody } from '@base/api/model/req-body';

export class FI000405ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    fundCode = '';
    currType = '';
    amount = '';
    payAcnt = '';
    salesId = '';
    salesName = '';
    introId = '';
    introName = '';
    effectDate = '';
    notiCD = '';
    sLossCD = '';
    sLoss = '';
    sProCD = '';
    sPro = '';
    constructor() {
        super();
    }
}
