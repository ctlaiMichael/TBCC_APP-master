import { ReqBody } from '@base/api/model/req-body';

export class BI000100ReqBody extends ReqBody {
    custId: string;
    userId: string;
    token: string;
    functionType: string;

    constructor() {
        super();
        this.custId = '';
        this.userId = '';
        this.token = '';
        this.functionType = '';
    }
}

