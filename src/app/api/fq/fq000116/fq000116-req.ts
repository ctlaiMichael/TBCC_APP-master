import { ReqBody } from '@base/api/model/req-body';

export class FQ000116ReqBody extends ReqBody {

  custId = '';
  acqBank = '';
  cardPlan = '';
  encRetURL = '';
  merchantId = '';
  orderNumber = '';
  responseCode = '';
  terminalId = '';

  constructor() {
    super();
  }
}

