import { ReqBody } from '@base/api/model/req-body';

export class F5000101ReqBody extends ReqBody {
  custId = '';
  type = '' ;
  openNightChk = '';

  constructor() {
    super();
  }
}

