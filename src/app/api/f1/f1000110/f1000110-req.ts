import { ReqBody } from '@base/api/model/req-body';

export class F1000110ReqBody extends ReqBody {
    custId = '';
    workingStatus = '';
    occupation = '';
    annualIncome = '';
    companyName = '';
    jobTitle = '';
    constructor() {
        super();
    }
}
