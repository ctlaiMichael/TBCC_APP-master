import { ReqBody } from '@base/api/model/req-body';

export class FG000406ReqBody extends ReqBody {
    custId='';
    bankNo='';
    accountNo='';
    accountNickName='';
    currency='';
    constructor() {
        super();
    }
}

