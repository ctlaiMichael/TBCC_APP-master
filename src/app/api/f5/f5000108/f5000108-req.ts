// F5000107:外幣預約轉帳註銷
import { ReqBody } from '@base/api/model/req-body';

export class F5000108ReqBody extends ReqBody {
    custId = '';
    transDateS = '';
    transDateE = '';
    type = '';
  constructor() {
    super();
  }
}

