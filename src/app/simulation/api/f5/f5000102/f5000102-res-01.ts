//外幣匯率查詢
export const f5000102_res_01 = {
  "MNBResponse": {
    "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "resHeader": {
      "requestNo": "2010_12_22_13_32_21_531_12345",
      "requestTime": "2010-12-22T13:32:21.578+08:00",
      "responseTime": "2010-12-22T13:32:21.750+08:00",
      "custId": null
    },
    "result": {
      "@xmlns:f50": "http://mnb.hitrust.com/service/schema/F5000102",
      "@xsi:type": "f50:F5000102ResultType",

        "f50:trnsfrOutCurr":"TWD",
        "f50:trnsfrOutAmount":"3000.00",
        "f50:trnsfrInCurr":"USD",
        "f50:trnsfrInAmount":"102.88",
        "f50:trnsfrRate":"29.1600",
        "f50:trnsfrCostRate":"28.7620",
        "f50:trnsfrOutRate":"4.4690",
        "f50:trnsfrInRate":"30.8380",
        "f50:rate":"28.8850",
    }
  }
};
