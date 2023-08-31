/**
 * F9000101-借款查詢
 * custId	身分證字號	string		統一編號
 * paginator	paginator	Element	
 */
import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F9000101ReqBody extends ReqBody {
    custId = '';
    paginator: Paginator;

    constructor() {
        super();
        this.paginator = new Paginator();
        // this.paginator['sortColName'] = 'expirDate';
        // this.paginator['sortDirection'] = 'DESC';
        // native
        this.paginator['sortColName'] = 'acctNo';
        this.paginator['sortDirection'] = 'ASC';
    }
}

