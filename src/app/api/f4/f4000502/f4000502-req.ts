import { ReqBody } from '@base/api/model/req-body';

export class F4000502ReqBody extends ReqBody {
    custId = '';
    trnsfrDate = '';
    orderDate = '';
    orderNo = '';
    trnsToken = '';
    trnsfrOutAccnt = '';
    trnsfrInBank = '';
    trnsfrInAccnt = '';
    trnsfrAmount = '';
    constructor() {
        super();
    }
}
