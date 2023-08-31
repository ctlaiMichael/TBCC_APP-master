import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class F9000501ReqBody extends ReqBody {
  custId = '';
  caseStatus = '';
  paginator: Paginator;
  constructor() {
    super();
    this.paginator = new Paginator();
    this.paginator['sortColName'] = 'transCode';
    this.paginator['sortDirection'] = 'ASC';
  }
}

