import { ReqBody } from '@base/api/model/req-body';

export class FK000103ReqBody extends ReqBody {
    custId = '';
    lostType = '';
    accountNo = '';
    replacementWay = '';
    sendTo = '';
    password = '';
    constructor() {
        super();
    }
}

