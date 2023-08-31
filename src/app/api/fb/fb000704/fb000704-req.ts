import { ReqBody } from '@base/api/model/req-body';

export class FB000704ReqBody extends ReqBody {

    custId: string;
    goldTxFlag: string;

    constructor() {
        super();
        this.custId = '';
        this.goldTxFlag = '';
    }
}
