import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000103ReqBody extends ReqBody {
    custId = '';
    transCode = '';
    fundCode = '';
    startDate = '';
    endDate = '';
    paginator: Paginator;
    constructor() {
        super();
        this.paginator = new Paginator();
    }
}
