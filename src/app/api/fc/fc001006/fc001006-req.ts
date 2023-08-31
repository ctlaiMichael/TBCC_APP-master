import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FC001006ReqBody extends ReqBody {
  custId = '';
  type = '';
  constructor() {
    super();
  }
}

