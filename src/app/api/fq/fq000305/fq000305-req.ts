import { ReqBody } from '@base/api/model/req-body';

export class FQ000305ReqBody extends ReqBody {
    custId = '';
    mobileBarcode = '';
    loveCode = '';
    socialWelfareName = '';
    defaultBarcode = '';
    constructor() {
        super();
    }
}

