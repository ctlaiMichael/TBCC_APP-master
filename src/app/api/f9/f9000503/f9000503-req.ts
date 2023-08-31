import { ReqBody } from '@base/api/model/req-body';

export class F9000503ReqBody extends ReqBody {
  custId = '';
  txKind = '';
  ebkCaseNo = '';
  dataType = '';
  constructor() {
    super();
  }
}

