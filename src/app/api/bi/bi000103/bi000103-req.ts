import { ReqBody } from '@base/api/model/req-body';

export class BI000103ReqBody extends ReqBody {
    custId: string;
    userId: string;
    license: string;
    deviceId: string;
    setType: string;
    constructor() {
        super();
        this.custId = '';
        this.userId = '';
        this.license = '';
        this.deviceId = '';
        this.setType = '';
    }
}

