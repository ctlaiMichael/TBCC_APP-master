import { ReqBody } from '@base/api/model/req-body';

export class F9000403ReqBody extends ReqBody {
  custId = '';
  txKind = '';
  ebkcaseno = '';

  constructor() {
    super();
  }
}

