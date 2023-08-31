import { ReqBody } from '@base/api/model/req-body';

export class FB000708ReqBody extends ReqBody {
    custId = '';
    recType = '';
    goldAccount = '';
    trnsfrAccount = '';
    goldQuantity = '';
    constructor() {
        super();
    }
}
