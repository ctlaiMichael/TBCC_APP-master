import { ReqBody } from '@base/api/model/req-body';

export class FQ000111ReqBody extends ReqBody {
    custId = '';
    merchantName = '';
    orderNumber = '';
    trnsfrOutAcct = '';
    trnsfrInBank = '';
    trnsfrInAcct = '';
    trnsfrAmount = '';
    notePayer = '';
    notePayee = '';
    trnsToken = '';
}

