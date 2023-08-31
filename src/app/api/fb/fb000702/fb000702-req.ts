import { ReqBody } from '@base/api/model/req-body';

export class FB000702ReqBody extends ReqBody {
    custId: string;
    queryType: string;
    startDate: string;
    endDate: string;
    constructor() {
        super();
        this.custId = '';
        this.queryType = '';
        this.startDate = '';
        this.endDate = '';
    }
}
