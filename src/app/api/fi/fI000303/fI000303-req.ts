import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000303ReqBody extends ReqBody {
    custId = '';
    constructor() {
        super();
    }
}
