import { ReqBody } from '@base/api/model/req-body';

export class F4000102ReqBody extends ReqBody {
    custId = '';
    trnsfrOutAccnt =  '';
    trnsfrInBank =  '';
    trnsfrInAccnt =  '';
    trnsInSetType = '';
    trnsfrAmount =  '';
    notePayer =  '';
    notePayee =  '';
    businessType =  '';
    trnsToken =  '';
    constructor() {
        super();
    }
}
