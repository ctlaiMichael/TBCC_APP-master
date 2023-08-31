import { ReqBody } from '@base/api/model/req-body';

export class FI000201ReqBody extends ReqBody {
    custId = '';
    type = '';
    constructor() {
        super();
    }
}
