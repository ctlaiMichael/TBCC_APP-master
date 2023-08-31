// 台幣定存交易明細查詢
import { ReqBody } from '@base/api/model/req-body';
// import { Paginator } from '@base/api/model/paginator';

export class F2100102ReqBody extends ReqBody {
    custId = '';
    acctNo = '';
    acctType = '';
    // paginator: Paginator;

    constructor() {
        super();
        // this.paginator = new Paginator();
        // this.paginator['sortColName'] = 'transDate';
        // this.paginator['sortDirection'] = 'DESC';
    }
}

