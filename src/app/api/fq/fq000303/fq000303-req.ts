import { ReqBody } from '@base/api/model/req-body';

export class FQ000303ReqBody extends ReqBody {
    custId = '';
    trnsGenerateTime = '';
    trnsfrOutAcct = '';
    cardToken = '';
    constructor() {
        super();
    }
}

