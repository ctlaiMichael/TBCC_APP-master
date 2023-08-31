// 台幣帳戶查詢
import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F2000101ReqBody extends ReqBody {
    custId = '';
    paginator: Paginator;

    constructor() {
        super();
        this.paginator = new Paginator();
        this.paginator['sortColName'] = '';
        this.paginator['sortDirection'] = 'DESC';

    }
}

