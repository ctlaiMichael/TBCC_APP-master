import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000701ReqBody extends ReqBody {
    custId = '';
    unitType = '';
    investType = '';
    filterFlag = '';
    paginator: Paginator;
    constructor() {
        super();
        this.paginator = new Paginator();
        this.paginator['sortColName'] = 'fundCode';
        this.paginator['sortDirection'] = 'DESC';
    }
}
