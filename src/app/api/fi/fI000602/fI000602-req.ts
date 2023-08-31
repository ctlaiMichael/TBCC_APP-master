import { ReqBody } from '@base/api/model/req-body';

export class FI000602ReqBody extends ReqBody {
    custId = '';
    reserveTransCode = '';
    trnsToken = '';
    branchName = '';
    unitCall = '';
    constructor() {
        super();
    }
}
