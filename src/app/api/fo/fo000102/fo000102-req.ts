import { ReqBody } from '@base/api/model/req-body';

export class FO000102ReqBody extends ReqBody {

  localType = '';       // 定位類型: 0-GPS, 1-自選縣/區域

  // === 定位類型為 '0' GPS時`，此欄位必輸入 === //
  lon = '';             // GPS經度座標
  lat = '';             // GPS緯度座標
  searchScope = '';     // GPS查詢範圍

  // === 定位類型為 '1' 自選縣/區域時，此欄位必輸入 === //
  county = '';          // 縣市名稱
  region = '';          // 區域名稱
  searchText = '';      // 縣市/區域/查詢

  constructor() {
    super();
  }

}
