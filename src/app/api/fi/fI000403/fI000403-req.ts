import { ReqBody } from '@base/api/model/req-body';

export class FI000403ReqBody extends ReqBody {
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
    notiCD = '';
    sLossCD = '';
    sLoss = '';
    sProCD = '';
    sPro = '';
    constructor() {
        super();
    }
}
