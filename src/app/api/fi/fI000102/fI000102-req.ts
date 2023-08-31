import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000102ReqBody extends ReqBody {
    custId = '';
    paginator: Paginator;
    constructor() {
        super();
        this.paginator = new Paginator();
    }
}
