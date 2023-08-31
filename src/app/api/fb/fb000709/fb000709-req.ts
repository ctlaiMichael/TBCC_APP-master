import { ReqBody } from '@base/api/model/req-body';

export class FB000709ReqBody extends ReqBody {
    custId = '';
    recType = '';
    goldAccount = '';
    trnsfrAccount = '';
    goldQuantity = '';
    goldRateTime = '';
    gold1GAmt = '';
    transAmt = '';
    discountAmt = '';
    trnsToken = '';
    constructor() {
        super();
    }
}
