import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FB000705ReqBody extends ReqBody {
    custId: string;
    queryType: string;
    constructor() {
        super();
        this.custId = '';
        this.queryType = '';
    }
}

