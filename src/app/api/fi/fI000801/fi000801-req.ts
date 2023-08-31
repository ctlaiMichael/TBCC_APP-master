import { ReqBody } from '@base/api/model/req-body';

export class FI000801ReqBody extends ReqBody {
    custId = '';
    group='';
    constructor() {
        super();
    }
}
