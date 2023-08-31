import { ReqBody } from '@base/api/model/req-body';

export class FH000202ReqBody extends ReqBody {
    custId = '';
    hospitalId = '';
    branchId = '';
    personId = '';
    trnsOutBank = '';
    trnsOutAcct = '';
    totalCount = '';
    totalAmount = '';
    queryTime = '';
    trnsToken = '';
    details: any = {};

    constructor() {
        super();
    }
}
