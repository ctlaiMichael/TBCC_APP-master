export const f2000301_res_01 = {
  "MNBResponse": {
    "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "resHeader": {
      "requestNo": "8cdc3aa0be8404e075070cb7-f1000103",
      "requestTime": "2010-12-22T13:32:21.578+08:00",
      "responseTime": "2010-12-22T13:32:21.750+08:00",
      "custId": "B120281272"
    },
    "result": {
      "@xmlns:f20": "http://mnb.hitrust.com/service/schema/f2000201",
      "@xsi:type": "f20:f2000201ResultType",

      "f20:totalAmount":"60000",

      "f20:details": 
        // undefined,
      {
        "f20:detail": [
          {
            "f20:date": "1070607",
            "f20:acctNo": "0796-899-300865",
            "f20:checkNo": "支票號碼1",
            "f20:amount": "10000",
          },
          {
            "f20:date": "1060912",
            "f20:acctNo": "0796-899-300815",
            "f20:checkNo": "支票號碼2",
            "f20:amount": "10000",
          },
          {
            "f20:date": "1050217",
            "f20:acctNo": "0796-899-300845",
            "f20:checkNo": "支票號碼3",
            "f20:amount": "10000",
          },
          {
            "f20:date": "1040607",
            "f20:acctNo": "0760-899-300845",
            "f20:checkNo": "支票號碼4",
            "f20:amount": "10000",
          },
          {
            "f20:date": "1030607",
            "f20:acctNo": "0750-899-300845",
            "f20:checkNo": "支票號碼5",
            "f20:amount": "10000",
          },
          {
            "f20:date": "1020607",
            "f20:acctNo": "0778-899-300845",
            "f20:checkNo": "支票號碼6",
            "f20:amount": "5000",
          },
          {
            "f20:date": "1000607",
            "f20:acctNo": "0996-899-300845",
            "f20:checkNo": "支票號碼7",
            "f20:amount": "5000",
          },

        ]
      },
      "paginatedInfo": {
        "totalRowCount": "7"
        , "pageSize": "3"
        , "pageNumber": "1"
        , "sortColName": ""
        , "sortDirection": "ASC"
      }
    }
  }
};
