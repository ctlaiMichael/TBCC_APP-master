import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000402ReqBody extends ReqBody {
    custId = '';
    investType = '';
    fundType = '';
    selectfund = '';
    compCode = '';
    fundCode = '';
    constructor() {
        super();
    }
}
