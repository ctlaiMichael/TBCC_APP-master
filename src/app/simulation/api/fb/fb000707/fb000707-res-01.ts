// acctNo	帳號
// openBranchId	開戶分行代碼
// openBranchName	開戶分行名稱
// acctType	存款類別代碼
// acctTypeName	存款類別名稱
// currCode	幣別代碼
// currency	幣別
// currName	幣別名稱
// balance	餘額
// lastTrnsDate	最後交易日/定存到期日

export const fb000707_res_01 = {
  "MNBResponse": {
    "@xmlns:": "http://mnb.hitrust.com/service/schema",
    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "resHeader": {
      "requestNo": "2011_01_11_13_22_25_281_12345",
      "requestTime": "2011-01-11T13:22:25.281+08:00",
      "responseTime": "2011-01-11T13:22:25.296+08:00",
      "custId": "B1202812720"
    },
    "result": {
      "@xmlns:fb0": "http://mnb.hitrust.com/service/schema/fb000707",
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xsi:type": "fb0:fb000707ResultType",
      "fb0:realBal": "3541.36",
      "fb0:usefulBal": "3541.36",
      "fb0:todayCheckBal": "0.00",
      "fb0:tomCheckBal": "0.00",
      "fb0:freezeBal": "0.00",
      "fb0:distrainBal": "0.00",
      "fb0:afterRunBal": "0.00",
      "fb0:afterRunPay": "0.00",
      "fb0:saveBookBal": "3521.00",
      "fb0:managementBranch": "9997",
      "fb0:realBalUS": "16172.90",
      "fb0:usefulBalUS": "16172.90",
      "fb0:saveBookBalUS": "16172.90",
      "fb0:managementBranchName": "9997分行"
    }
  }
};
