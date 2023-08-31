import { ReqBody } from '@base/api/model/req-body';

export class FI000608ReqBody extends ReqBody {
    custId = '';
    CPKind = ''; // 推介註記
    constructor() {
        super();
    }
}
