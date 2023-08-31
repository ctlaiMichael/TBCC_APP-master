import { ReqBody } from '@base/api/model/req-body';

export class F1000105ReqBody extends ReqBody {
    custId = '';
    fnctId = '';
    depositNumber = '';
    depositMoney = '';
    OutCurr = '';
    transTypeDesc = '';
    constructor() {
        super();
        // this.custId = '';
        // this.fnctId = '';
        // this.depositNumber = '';
        // this.depositMoney = '';
        // this.OutCurr = '';
        // this.transTypeDesc = '';
    }
}

