import { ReqBody } from '@base/api/model/req-body';

export class FH000104ReqBody extends ReqBody {
    custId = "";
    hospitalId = "";
    branchId = "";
    personId = "";
    queryTimeFlag = "";
    trnsAcctNo = "";
    totalCount = "";
    totalAmount = "";
    businessType = "";
    trnsToken = "";
    isMySelfPayment = "";
    details = {

    };

    constructor() {
        super();
    }
}
