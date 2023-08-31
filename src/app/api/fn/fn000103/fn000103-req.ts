import { ReqBody } from '@base/api/model/req-body';

export class FN000103ReqBody extends ReqBody {
  custId = '';          // 身分證字號
  recType = '';         // 交易類別，固定帶1
  transType = '';       // 認證種類: 1-OTP, 2-ATM
  deviceId = '';        // 裝置識別碼
  trnsToken = '';       // 交易控制碼
  mailType = '';        // 通知類別
  accounts = {          // 提款帳號清單
    account: [          // 提款帳號資料
      {}
    ]
  };

  constructor() {
    super();
  }

}
