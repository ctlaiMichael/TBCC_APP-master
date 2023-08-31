import { ReqBody } from '@base/api/model/req-body';

export class F4000401ReqBody extends ReqBody {
    custId = '';
    trnsfrDate = '';
    trnsfrOutAccnt = '';
    trnsfrInBank = '';
    trnsfrInAccnt = '';
    trnsInSetType = '';
    trnsfrAmount = '';
    notePayer = '';
    notePayee = '';
    businessType = '';
    trnsToken = '';
    constructor() {
        super();
    }
}
