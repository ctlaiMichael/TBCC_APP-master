import { ReqBody } from '@base/api/model/req-body';

export class FI000401ReqBody extends ReqBody {
    custId = '';
    trnsType = '';
    pwd = '';
    constructor() {
        super();
    }
}
