import { ReqBody } from '@base/api/model/req-body';

export class F5000111ReqBody extends ReqBody {
  custId = '';
  trnsfrOutAccnt = '';
  trnsfrOutCurr = '';
  trnsfrOutAmount = '';
  trnsfrInAccnt = '';
  trnsInSetType = '';
  trnsfrInCurr = '';
  trnsfrInAmount = '';
  subType = '';
  trnsfrRate = '';
  trnsfrCurr='';
  note = '';
  negotiatedBranch= '';
  negotiatedNo= '';
  negotiatedCurr= '';
  trnsToken= '';


  constructor() {
    super();
  }
}

