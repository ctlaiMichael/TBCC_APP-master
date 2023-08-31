//繳納本人信用卡款
export const f8000401_res_01 = {
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
            "@xmlns:f50": "http://mnb.hitrust.com/service/schema/F8000401",
            "@xsi:type": "f80:F8000401ResultType",

            "custId": "B121194483",
            "hostCode": "4001",
            "trnsNo": "1234567890",
            "trnsDateTime": "20101231000000",
            "recordDate": "20101231",
            "trnsfrOutAccnt": "88569954",
            "trnsfrAmount": "10000",
            "trnsfrOutAccntBal": "980000",
            "hostCodeMsg": "交易成功",
            "trnsRsltCode": "0"
        }
    }
};
