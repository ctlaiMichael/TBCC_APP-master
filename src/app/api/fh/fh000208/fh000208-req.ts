import { ReqBody } from '@base/api/model/req-body';

export class FH000208ReqBody extends ReqBody {
    custId = '';
    hospitalId = '';
    branchId = '';
    personId = '';
    creditCardNo = '';
    validDate = '';
    checkCode = '';
    totalCount = '';
    totalAmount = '';
    queryTime = '';
    trnsToken = '';
    details: any = {};

    constructor() {
        super();
    }
}
