import { ReqBody } from '@base/api/model/req-body';

export class FI000702ReqBody extends ReqBody {
    custId = '';
    trustAcnt = '';
    transCode = '';
    fundCode = "";
    cost = "";
    constructor() {
        super();
    }
}
