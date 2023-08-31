import { ReqBody } from '@base/api/model/req-body';

export class FI000706ReqBody extends ReqBody {
    custId = '';
    trnsToken = '';
    details = {
        detail: [
            {}
        ]
    }
    constructor() {
        super();
    }
}
