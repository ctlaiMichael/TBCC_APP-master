import { ReqBody } from '@base/api/model/req-body';

export class FQ000115ReqBody extends ReqBody {

  custId = '';
  encQRCode = '';
  encRetURL = '';
  acqBank = '';
  merchantId = '';
  orderNumber = '';
  terminalId = '';
  verifyCode = '';

  constructor() {
    super();
  }
}

