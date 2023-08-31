import { ReqBody } from '@base/api/model/req-body';

export class FG000201ReqBody extends ReqBody {
    custId='';
    password='';
    oldConnId='';
    newConnId='';
    constructor() {
        super();
    }
}

