import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FB000501ReqBody extends ReqBody {
    paginator: Paginator;
    constructor() {
        super();
        this.paginator = new Paginator();
        this.paginator['sortColName'] = 'applyDateTime';
        this.paginator['sortDirection'] = 'DESC';
    }
}
