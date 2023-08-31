import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000202ReqBody extends ReqBody {
    custId = '';
    type = '';
    // startDate = '';
    // endDate = '';
    paginator: Paginator;
    constructor() {
        super();
        this.paginator = new Paginator();
    }
}
