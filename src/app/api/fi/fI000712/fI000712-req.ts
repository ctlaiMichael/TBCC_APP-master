import { ReqBody } from '@base/api/model/req-body';

export class FI000712ReqBody extends ReqBody {
    custId = '';
    enrollDate = '';
    constructor() {
        super();
    }
}
