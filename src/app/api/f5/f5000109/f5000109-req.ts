import { ReqBody } from '@base/api/model/req-body';

export class F5000109ReqBody extends ReqBody {
  custId = '';
  negotiatedCurr = '' ; //議價幣別
  fnctType = '';//交易類別

  constructor() {
    super();
  }
}

