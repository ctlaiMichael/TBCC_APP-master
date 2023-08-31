import { ReqBody } from '@base/api/model/req-body';

export class FI000408ReqBody extends ReqBody {
    custId = '';
    trustAcnt: '';
    fundCode: '';
    fundType: '';
    amount: '';
    payAcnt: '';
    salesId: ''; 
    salesName: '';
    introId: '';
    introName: '';
    enrollDate: '';
    effectDate: '';
    currency: '';
    baseRate: '';
    favorRate: '';
    serviceFee: '';
    payDate: '';
    payDateS: '';
    code: '';
    trnsToken: '';
    constructor() {
        super();
    }
}
