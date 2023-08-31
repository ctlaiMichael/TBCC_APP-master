import { ReqBody } from '@base/api/model/req-body';

export class FH000201ReqBody extends ReqBody {
    custId = "";
    hospitalId = "";
    branchId = "";
    personId = "";
    birthday = "";
    licenseNo = "";

    constructor() {
        super();
    }
}
