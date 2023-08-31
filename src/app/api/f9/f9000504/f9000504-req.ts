import { ReqBody } from '@base/api/model/req-body';

export class F9000504ReqBody extends ReqBody {
  custId = '';    // 身分證
  ebkCaseNo = ''; // 網銀案件編號
  constructor() {
    super();
  }
}

