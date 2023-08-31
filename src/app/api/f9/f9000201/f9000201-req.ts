import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F9000201ReqBody extends ReqBody {
    custId = '';
    account = '';
    startDate = '';
    endDate = '';
    paginator: Paginator;

    constructor() {
        super();
        this.paginator = new Paginator();
        this.paginator['sortColName'] = 'transDate';
        this.paginator['sortDirection'] = 'DESC';
    }
}

