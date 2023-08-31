import { ReqBody } from '@base/api/model/req-body';

export class FN000104ReqBody extends ReqBody {
  custId = '';     // 身分證字號
  recType = '';    // 交易類別: A-預約, D-取消
  nocrwdDay = '';  // 無卡提款預約交易日期YYYYMMDD
  trnsAccnt = '';  // 無卡提款帳號
  transAmt = '';   // 預約提款金額
  trasPwd = '';    // 一次性提款密碼(需使用3DES加密)
  nocrwdTime = ''; // 無卡提款有效時間(預設15分鐘，上限30分鐘)
  trnsTxNo = '';   // 無卡提款交易序號
  trnsToken = '';  // 交易控制碼
}
