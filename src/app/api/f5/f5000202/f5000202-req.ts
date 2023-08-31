// F5000201:繳交外幣保費
import { ReqBody } from '@base/api/model/req-body';

export class F5000202ReqBody extends ReqBody {
    custId = '';
    paymentObject = '';
    trnsfrOutAcct = '';
    trnsfrOutCurr = '';
    trnsfrAmount = '';
    paymentNumber = '';
    trnsToken = '';

  constructor() {
    super();
  }
}

