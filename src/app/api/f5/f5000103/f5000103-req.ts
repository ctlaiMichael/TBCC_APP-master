// 台外幣約定即時轉帳
import { ReqBody } from '@base/api/model/req-body';

export class F5000103ReqBody extends ReqBody {
    custId = '';
    trnsfrOutAccnt = '';
    trnsfrOutCurr = '';
    trnsfrOutAmount = '';
    trnsfrInAccnt = '';
    trnsInSetType = '';
    trnsfrInCurr = '';
    trnsfrInAmount = '';
    subType = '';
    trnsfrRate = '';
    trnsfrCostRate = '';
    note = '';
    businessType = '';
    trnsToken = '';
    openNightChk = '';

    constructor() {
        super();
        // this.custId = "";
        // this.type='';

    }
}

