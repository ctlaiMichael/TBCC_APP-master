import { ReqBody } from '@base/api/model/req-body';

export class FH000105ReqBody extends ReqBody {
    custId = "";
    hospitalId = "";
    branchId = "";
    startDate = "";
    endDate = "";

    constructor() {
        super();
    }
}
