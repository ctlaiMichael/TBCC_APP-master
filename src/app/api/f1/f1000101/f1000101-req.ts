import { ReqBody } from '@base/api/model/req-body';

export class F1000101ReqBody extends ReqBody {
    custId = '';
    userId = '';
    password = '';
    lessPwdLength = '';
    constructor() {
        super();
    }
}

