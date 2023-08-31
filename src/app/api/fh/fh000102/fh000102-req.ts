import { ReqBody } from '@base/api/model/req-body';

export class FH000102ReqBody extends ReqBody {
    custId = "";
    account = "";
    
    constructor() {
        super();
    }
}
