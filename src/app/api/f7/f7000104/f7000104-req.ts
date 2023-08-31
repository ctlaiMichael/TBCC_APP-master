import { ReqBody } from '@base/api/model/req-body';

export class F7000104ReqBody extends ReqBody {
    custId = '';           // 身分證字號
    constructor() {
        super();
    }
}
