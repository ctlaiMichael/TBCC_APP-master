import { ReqBody } from '@base/api/model/req-body';

export class FH000207ReqBody extends ReqBody {
    custId = '';
    hospitalId = '';
    branchId = '';
    refNo = '';
    amount = '';
    payDt = '';
    
    constructor() {
        super();
    }
}
