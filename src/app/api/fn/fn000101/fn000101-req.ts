import { ReqBody } from '@base/api/model/req-body';

export class FN000101ReqBody extends ReqBody {
  custId = '';          // 身分證字號
  recType = '';         // 交易類別: 1-新增帳號, 2-取消帳號
  transType = '';       // 認證種類: 1-OTP, 2-ATM
  deviceId = '';        // 裝置識別碼
  trnsToken = '';       // 交易控制碼
  mailType = '';        // 通知類別
  accounts = {          // 提款帳號清單
    account: [{         // 提款帳號資料
      trnsAccnt: '',    // 提款帳號
      trasCode: '',     // 認證碼，當認證種類為 ATM 此欄位需加密
      cancelFlag: ''    // 取消帳號註記: 0 取消單筆，1 全部取消(最後一筆)
    }]
  };

  constructor() {
    super();
  }

}
