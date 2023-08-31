import { ReqBody } from '@base/api/model/req-body';

export class FQ000302ReqBody extends ReqBody {
    custId = '';
    trnsToken = '';
    trnsfrOutAcct = '';
    mobileBarcode = '';
    // loginType='';
    constructor() {
        super();
    }
}

