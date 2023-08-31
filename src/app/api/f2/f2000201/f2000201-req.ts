import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F2000201ReqBody extends ReqBody {
    custId = '';
    paginator: Paginator;

    constructor() {
        super();
        this.paginator = new Paginator();
        // this.paginator['sortColName'] = 'acctNo';
        // this.paginator['sortDirection'] = 'DESC';
        // native:
        this.paginator['sortColName'] = '';
        this.paginator['sortDirection'] = 'ASC';

        // this.custId = "";
        // this.paginator = {
        //   pageSize: 3,
        //   pageNumber: 1,
        //   sortColName: "acctNo",
        //   sortDirection: "ASC"
        // };
    }
}

