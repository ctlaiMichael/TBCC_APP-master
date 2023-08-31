import { ReqBody } from '@base/api/model/req-body';

export class F6000202ReqBody extends ReqBody {
    custId= '';
    fDAccount= '';
    balance= '';
    mBAccount= '';
    businessType= '';
    trnsToken= '';
    constructor() {
        super();
    }
}
