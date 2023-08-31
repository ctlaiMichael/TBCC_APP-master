/**
 * F2000502-我的金庫查詢
 */
import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F2000501ReqBody extends ReqBody {
    custId = '';

    constructor() {
        super();
    }
}

