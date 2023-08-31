import { ReqBody } from '@base/api/model/req-body';

export class BI000102ReqBody extends ReqBody {
    custId: string;
    userId: string;
    mac: string;

    constructor() {
        super();
        this.custId = '';
        this.userId = '';
        this.mac = '';
    }
}

