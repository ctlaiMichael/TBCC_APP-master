import { ReqBody } from '@base/api/model/req-body';

export class FF000102ReqBody extends ReqBody {
    custId='';
    newZipCode='';
    newAddress='';
    newTel='';
    constructor() {
        super();
    }
}

