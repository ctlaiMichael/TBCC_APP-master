import { ReqBody } from '@base/api/model/req-body';

export class F6000302ReqBody extends ReqBody {
    currency = "";
    transfrTimes = "";

    trnsfrOutAccnt = '';
    transfrAmount = '';
    autoTransCode = '';
    computeIntrstType = '';
    constructor() {
        super();
    }
}
