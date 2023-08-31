import { ReqBody } from '@base/api/model/req-body';
import { PAGE_SETTING } from '@conf/page';

export class F9000303ReqBody extends ReqBody {
  custId = '';
  borrowAccount='';
  trnsfrOutAccnt='';
  trnsfrAmount='';
  issueSeq='';
  trxType= '';
  payType='';
  businessType='';
  trnsToken='';
  constructor() {
    super();
  }
}

