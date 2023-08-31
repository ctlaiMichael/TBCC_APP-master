import { ReqBody } from '@base/api/model/req-body';

export class FO000103ReqBody extends ReqBody {

  type = '';        // 類別: 0-取得分行業務清單, 1-取得分行業務號碼牌
  branchId = '';    // 分行代碼

  // === 類別為 '1' 時，此欄位為必輸入 === //
  saleId = '';      // 業務代碼
  deviceId = '';    // 裝置識別碼

  constructor() {
    super();
  }

}
