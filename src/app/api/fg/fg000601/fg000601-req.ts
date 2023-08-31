import { ReqBody } from '@base/api/model/req-body';

export class FG000601ReqBody extends ReqBody {
    custId='';
    connId='';
    oldConnPswd='';
    newConnPswd='';
    constructor() {
        super();
    }
}

