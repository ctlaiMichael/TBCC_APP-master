import { ReqBody } from '@base/api/model/req-body';

export class FI000802ReqBody extends ReqBody {
    custId = '';
    group = '';
    fundCodes = '';
    constructor() {
        super();
    }
}
