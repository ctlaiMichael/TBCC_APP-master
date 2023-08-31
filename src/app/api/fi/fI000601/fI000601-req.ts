import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000601ReqBody extends ReqBody {
    custId = '';
    startDate = '';
    endDate = '';
    status = '';
    transType = '';
    paginator: Paginator;
    constructor() {
        super();
        this.paginator = new Paginator();
        this.paginator['sortColName'] = 'reserveTransCode';
        this.paginator['sortDirection'] = 'ASC';
    }
}
