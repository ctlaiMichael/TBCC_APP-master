import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FB000706ReqBody extends ReqBody {
    custId: string;
    account: string;
    startDate: string;
    endDate: string;
    paginator: Paginator;
    constructor() {
        super();
        this.custId = '';
        this.account = '';
        this.startDate = '';
        this.endDate = '';
        this.paginator = new Paginator();
        this.paginator['sortColName'] = 'date';
        this.paginator['sortDirection'] = 'DESC';
    }
}

