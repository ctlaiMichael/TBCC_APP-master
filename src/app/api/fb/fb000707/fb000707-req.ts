import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FB000707ReqBody extends ReqBody {
    account: string;
    custId: string;
    constructor() {
        super();
        this.custId = '';
        this.account = '';

    }
}

