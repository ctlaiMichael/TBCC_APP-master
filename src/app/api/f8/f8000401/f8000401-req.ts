// 繳納本人信用卡款
import { ReqBody } from '@base/api/model/req-body';

export class F8000401ReqBody extends ReqBody {
    custId = '';
    trnsfrOutAccnt = '';
    trnsfrAmount = '';
    businessType = '';
    trnsToken = '';

  constructor() {
    super();
  }
}

