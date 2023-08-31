/**
 * custId	身分證字號
 */
import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FC001001ReqBody extends ReqBody {
    custId = '';
    appInputFlag = '';
    paginator: Paginator;
    constructor() {
        super();
        this.paginator = new Paginator();
        this.paginator['sortColName'] = 'creditCardNo';
        this.paginator['sortDirection'] = 'ASC';
    }
}
