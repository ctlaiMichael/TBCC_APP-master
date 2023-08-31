// F5000107:外幣預約轉帳註銷
import { ReqBody } from '@base/api/model/req-body';

export class F5000107ReqBody extends ReqBody {
    custId = '';
    trnsfrDate = '';
    // orderDate = '';TODO:電文規格與範例不同需確認
    orderNo = '';
    trnsToken = '';
    trnsfrOutAccnt = '';
    trnsfrInAccnt = '';
    trnsfrCurr = '';
    trnsfrAmount = '';
    subType = '';
    note = '';

  constructor() {
    super();
    // this.custId = "";
    // this.type='';

  }
}

