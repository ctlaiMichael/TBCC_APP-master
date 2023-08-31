// 台外幣約定預約轉帳
import { ReqBody } from '@base/api/model/req-body';

export class F5000105ReqBody extends ReqBody {
    custId = '';
    trnsfrDate = '';
    trnsfrOutAccnt = '';
    trnsfrOutCurr = '';
    trnsfrInAccnt = '';
    trnsInSetType = '';
    trnsfrInCurr = '';
    trnsfrAmount = '';
    trnsfrCurr = '';
    subType = '';
    subTypeDscp = '';
    note = '';
    trnsToken = '';

  constructor() {
    super();
    // this.custId = "";
    // this.type='';

  }
}

