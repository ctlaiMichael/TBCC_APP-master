import { ReqBody } from '@base/api/model/req-body';

export class FH000103ReqBody extends ReqBody {
    custId = "";
    personId = "";
    chartNo = "";
    birthday = "";

    constructor() {
        super();
    }
}
