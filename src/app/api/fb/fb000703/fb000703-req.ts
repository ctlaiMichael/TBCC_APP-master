import { ReqBody } from '@base/api/model/req-body';

export class FB000703ReqBody extends ReqBody {
    custId: string;
    constructor() {
        super();
        this.custId = '';
    }
}
