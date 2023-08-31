import { ReqBody } from '@base/api/model/req-body';
import { Paginator } from '@base/api/model/paginator';

export class FN000105ReqBody extends ReqBody {
  custId = '';            // 身分證字號
  recType = '';           // 交易類別: Q-查詢
  paginator: Paginator;   // 分頁設定

  constructor() {
    super();
    this.paginator = new Paginator();
    this.paginator['pageSize'] = 10;
    this.paginator['sortColName'] = 'applyDateTime';
    this.paginator['sortDirection'] = 'DESC';

  }
}
