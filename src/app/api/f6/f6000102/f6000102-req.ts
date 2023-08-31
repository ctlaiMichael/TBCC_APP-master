import { ReqBody } from '@base/api/model/req-body';

export class F6000102ReqBody extends ReqBody {
    custId = '';
    inteAccnt= '';
    transfrType= '';
    transfrTimes= '';
    transfrRateType= '';
    transfrAmount= '';
    autoTransCode= '';
    businessType= '';
    trnsToken= '';
    constructor() {
        super();
    }
}
