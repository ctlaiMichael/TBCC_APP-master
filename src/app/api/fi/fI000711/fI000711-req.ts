import { ReqBody } from '@base/api/model/req-body';

export class FI000711ReqBody extends ReqBody {
    custId = '';
    transCode = '';
    constructor() {
        super();
    }
}
