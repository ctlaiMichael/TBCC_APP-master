import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F2000402ReqBody extends ReqBody {
    custId = '';
    account = '';
    paginator: Paginator;

    constructor() {
        super();
        this.paginator = new Paginator();
        this.paginator['sortColName'] = 'acctNo';
        this.paginator['sortDirection'] = 'DESC';
        // native:
        // this.paginator['sortColName'] = ''; // 不明: "" + ConnectionController.getInstance().getTime();// TODO
        // this.paginator['sortDirection'] = 'ASC';
    }
}

