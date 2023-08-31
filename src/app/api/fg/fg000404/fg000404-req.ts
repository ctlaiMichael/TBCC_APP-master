import { ReqBody } from '@base/api/model/req-body';

export class FG000404ReqBody extends ReqBody {
    custId='';
    action='';
    trnsInBank='';
    trnsInAccnt='';
    accntName='';
    constructor() {
        super();
    }
}

