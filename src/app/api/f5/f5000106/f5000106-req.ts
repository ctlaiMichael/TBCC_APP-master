// 外幣活存預約轉帳查詢
import { ReqBody } from '@base/api/model/req-body';

export class F5000106ReqBody extends ReqBody {
    custId = '';
    exchangeType = '';
    startDate = '';
    endDate = '';
    trnsfrOutAccnt = '';

  constructor() {
    super();
    // this.custId = "";
    // this.type='';

  }
}

