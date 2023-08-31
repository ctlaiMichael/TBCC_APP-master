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

export const fb000706_res_01 = {
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
      "@xmlns:fb0": "http://mnb.hitrust.com/service/schema/fb000706",
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xsi:type": "fb0:fb000706ResultType",

      "fb0:details": {
        "fb0:detail": [
          {
            "fb0:transDate": "20190301",
            "fb0:withdraw": "20",
            "fb0:deposit": "0",
            "fb0:balance": "200",
            "fb0:digest": "",
            "fb0:branchID": "0021",
            "fb0:branchName": "合庫西湖",
            "fb0:remarks": "",
            "fb0:checkNo": "",
            "fb0:transTime": "163000",
            "fb0:seqNo": "012345678912"
          },
          {
            "fb0:transDate": "20190302",
            "fb0:withdraw": "0",
            "fb0:deposit": "20",
            "fb0:balance": "200",
            "fb0:digest": "",
            "fb0:branchID": "0021",
            "fb0:branchName": "合庫西湖",
            "fb0:remarks": "",
            "fb0:checkNo": "",
            "fb0:transTime": "163000",
            "fb0:seqNo": "012345678912"
          },
          {
            "fb0:transDate": "20190303",
            "fb0:withdraw": "0",
            "fb0:deposit": "40",
            "fb0:balance": "230",
            "fb0:digest": "",
            "fb0:branchID": "0021",
            "fb0:branchName": "合庫西湖",
            "fb0:remarks": "",
            "fb0:checkNo": "",
            "fb0:transTime": "163000",
            "fb0:seqNo": "012345678912"
          }
        ]

      },
      "paginatedInfo": {
        "totalRowCount": "3"
        , "pageSize": "2"
        , "pageNumber": "1"
        , "sortColName": ""
        , "sortDirection": "ASC"
      }
    }
  }
};
