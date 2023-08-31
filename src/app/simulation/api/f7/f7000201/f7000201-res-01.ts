export const f7000201_res_01 = {
  "MNBResponse": {
    "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "resHeader": {
      "requestNo": "8cdc3aa0be8404e075070cb7-f7000201",
      "requestTime": "2019-03-25T18:37:44.777+08:00",
      "responseTime": "2019-03-25T18:37:44.777+08:00",
      "custId": null 
    },

    "result": {
      "@xmlns:f70": "http://mnb.hitrust.com/service/schema/f7000201",
      "@xsi:type": "f70:f7000201ResultType",
      "f70:custId": "B1202812720",
      "f70:hostCode": "4001",
      "f70:trnsNo": "1111",
      "f70:trnsDateTime": "20190716193259",
      "f70:hostCodeMsg": "",
      "f70:recordDate": "1000101",
      "f70:account": "0345666876543",
      "f70:trnsfrAmount": "12321",
      "f70:bussNO": "6555555",
      "f70:balance": "6666666",
      "f70:trnsRsltCode": '0' ,
    }

    // 錯誤範例測試
    // "result": {
    //   "@xmlns:f70": "http://mnb.hitrust.com/service/schema/f7000201",
    //   "@xsi:type": "f70:f7000201ResultType",
    //   "f70:custId": "B1202812720",
    //   "f70:hostCode": "4001",
    //   "f70:trnsNo": "1111",
    //   "f70:trnsDateTime": "9990101000000",
    //   "f70:hostCodeMsg": "台灣水費水號錯誤",
    //   "f70:recordDate": "1000101",
    //   "f70:account": "0645899300865",
    //   "f70:trnsfrAmount": "12321",
    //   "f70:bussNO": "6555555",
    //   "f70:balance": "6666666",
    //   "f70:trnsRsltCode": '1' ,
    // }
  }
};

