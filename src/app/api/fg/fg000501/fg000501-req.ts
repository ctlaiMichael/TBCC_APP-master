import { ReqBody } from '@base/api/model/req-body';

export class FG000501ReqBody extends ReqBody {
    custId: string;
    constructor() {
        super();
        this.custId = '';
    }
}

