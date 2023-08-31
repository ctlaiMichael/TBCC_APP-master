export const f7000801_res_01 = {
  "MNBResponse": {
    "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "resHeader": {
      "requestNo": "8cdc3aa0be8404e075070cb7-f7000801",
      "requestTime": "2019-03-25T18:37:44.777+08:00",
      "responseTime": "2019-03-25T18:37:44.777+08:00",
      "custId": null 
    },

    "result": {
      "@xmlns:f70": "http://mnb.hitrust.com/service/schema/f7000801",
      "@xsi:type": "f70:f7000801ResultType",
      "f70:custId": "B1202812720",
      "f70:hostCode": "4001",
      "f70:trnsNo": "1111",
      "f70:trnsDateTime": "1080902135238",
      "f70:hostCodeMsg": "繳費成功",
      "f70:recordDate": "1080601",
      "f70:account": "0645899300865",
      "f70:payAmount": "12346",
      "f70:balance": "6116.00",
      "f70:bussNO": "1234567890",
      "f70:trnsRsltCode": '0' ,
    }


    // 錯誤範例測試
    // "result": {
    //   "@xmlns:f70": "http://mnb.hitrust.com/service/schema/f7000801",
    //   "@xsi:type": "f70:f7000801ResultType",
    //   "f70:custId": "B1202812720",
    //   "f70:hostCode": "4001",
    //   "f70:trnsNo": "1111",
    //   "f70:trnsDateTime": "1080902135238",
    //   "f70:hostCodeMsg": "存款不足",
    //   "f70:recordDate": "1080601",
    //   "f70:account": "0645899300865",
    //   "f70:payAmount": "12346",
    //   "f70:balance": "6116.00",
    //   "f70:bussNO": "1234567890",
    //   "f70:trnsRsltCode": '1' ,
    // }
  }
};

