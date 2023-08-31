import { ReqBody } from '@base/api/model/req-body';

export class RegisterReqBody extends ReqBody {
    udid            : string;
    appuid          : string;
    model           : string;
    platform        : string;
    osversion       : string;
    appversion      : string;
    name            : string;
    manufacturer    : string;
    hack            : boolean;
    pushon          : boolean;
    tokenid         : string;

    constructor() {
        super();
        this.udid = '';
        this.appuid = '';
        this.model = '';
        this.platform = '';
        this.osversion = '';
        this.appversion = '';
        this.name = '';
        this.manufacturer = '';
        this.hack = true;
        this.pushon = true;
        this.tokenid = '';
    }
}

