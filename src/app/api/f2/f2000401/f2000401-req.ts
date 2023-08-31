import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F2000401ReqBody extends ReqBody {
    custId = '';
    paginator: Paginator;

    constructor() {
        super();
        this.paginator = new Paginator();
        this.paginator['sortColName'] = 'lastTransDay';
        this.paginator['sortDirection'] = 'DESC';
        // native:
        // this.paginator['sortColName'] = 'acctNo';
        // this.paginator['sortDirection'] = 'ASC';
    }
}

