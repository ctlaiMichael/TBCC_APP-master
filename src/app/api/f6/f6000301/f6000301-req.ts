import { ReqBody } from '@base/api/model/req-body';

export class F6000301ReqBody extends ReqBody {
    custId = "";
    trnsfrOutAccnt = "";
    trnsfrOutCurr = "";
    transfrTimes = "";
    autoTransCode = "";
    transfrAmount = "";
    businessType = "";
    trnsToken = "";
    computeIntrstType = "";

    constructor() {
        super();
    }
}
