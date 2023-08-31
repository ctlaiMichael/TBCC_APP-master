import { ReqBody } from '@base/api/model/req-body';

export class FI000407ReqBody extends ReqBody {
    custId = '';
    trustAcnt: '';
    fundCode: '';
    currType: '';
    amount: '';
    payAcnt: '';
    salesId: ''; 
    salesName: '';
    introId: '';
    introName: '';
    payDate: '';
    code: '';
    constructor() {
        super();
    }
}
