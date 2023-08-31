import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FI000304ReqBody extends ReqBody {
    custId = '';
    paginator: Paginator;
    constructor() {
        super();
        this.paginator = new Paginator();
    }
}
