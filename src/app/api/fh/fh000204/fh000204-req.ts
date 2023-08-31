import { ReqBody } from '@base/api/model/req-body';

export class FH000204ReqBody extends ReqBody {
    custId = '';
    hospitalId = '';
    branchId = '';
    personId = '';
    totalCount = '';
    totalAmount = '';
    queryTime = '';
    details = {
        
    };


    constructor() {
        super();
    }
}
