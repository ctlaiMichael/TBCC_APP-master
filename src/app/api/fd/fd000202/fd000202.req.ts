import { ReqBody } from '@base/api/model/req-body';

export class FD000202ReqBody extends ReqBody {
    custId: string;
    constructor() {
        super();
        this.custId = '';
    }
}
