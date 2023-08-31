import { ReqBody } from '@base/api/model/req-body';

export class FQ000102ReqBody extends ReqBody {
    custId = '';
    EMVQRCode = '';
    constructor() {
        super();
    }
}

