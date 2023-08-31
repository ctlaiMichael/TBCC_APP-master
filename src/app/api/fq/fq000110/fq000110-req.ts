import { ReqBody } from '@base/api/model/req-body';

export class FQ000110ReqBody extends ReqBody {
    custId = '';
    trnsfrOutAcct = '';
    trnsfrInBank = '';
    trnsfrInAcct = '';
    trnsfrAmount = '';
    notePayer = '';
    notePayee = '';
    trnsToken = '';
}

