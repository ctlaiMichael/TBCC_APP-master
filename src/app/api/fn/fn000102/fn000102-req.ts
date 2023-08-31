import { ReqBody } from '@base/api/model/req-body';

export class FN000102ReqBody extends ReqBody {
  custId = '';     // 身分證字號
  queryType = '';  // 查詢種類, 6-無卡提款(預設)

  constructor() {
    super();
  }

}
