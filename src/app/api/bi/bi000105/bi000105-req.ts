import { ReqBody } from '@base/api/model/req-body';

export class BI000105ReqBody extends ReqBody {
    custId: string;
    userId: string;
    password:string;
    mac: string;
    // licenseType: string;
    // bodyDeviceId:string;
    constructor() {
        super();
        this.custId = '';
        this.userId = '';
        this.password='';
        this.mac = '';
        // this.licenseType='';
        // this.bodyDeviceId='';
    }
}

