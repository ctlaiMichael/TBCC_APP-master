import { ReqBody } from '@base/api/model/req-body';
import { PAGE_SETTING } from '@conf/page';

export class F9000302ReqBody extends ReqBody {
  custId = '';
  borrowAccount='';

  constructor() {
    super();
    // this.custId = "";
  }
}

