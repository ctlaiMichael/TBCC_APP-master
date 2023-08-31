import { ReqBody } from '@base/api/model/req-body';

export class FG000101ReqBody extends ReqBody {
    custId='';
    connId='';
    oldConnPswd='';
    newConnPswd='';
    constructor() {
        super();
    }
}

