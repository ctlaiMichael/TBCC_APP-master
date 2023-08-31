// 外幣約定即時轉帳
import { ReqBody } from '@base/api/model/req-body';

export class F5000104ReqBody extends ReqBody {
    custId = '';
    trnsfrOutAccnt = '';
    trnsfrOutCurr = '';
    trnsfrOutAmount = '';
    trnsfrInAccnt = '';
    trnsfrInId = '';
    trnsfrInCurr = '';
    trnsfrInAmount = '';
    trnsfrOutRate = '';
    trnsfrInRate = '';
    note = '';
    businessType = '';
    trnsToken = '';

    constructor() {
        super();
        // this.custId = "";
        // this.type='';

    }
}

