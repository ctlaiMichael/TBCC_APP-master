//外幣保費資料查詢
export const f5000201_res_01 = {
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
            "@xmlns:f50": "http://mnb.hitrust.com/service/schema/F5000201",
            "@xsi:type": "f50:F5000201ResultType",

            "f50:custId": "B1202812720",
            "f50:hostCode": "4001",
            "f50:hostCodeMsg": "交易成功",
            "f50:trnsRsltCode": "0",
            "f50:paymentObject": "A",
            "f50:trnsOutAccts": {
                "f50:trnsOutAcct": [
                    {
                        "f50:acctNo": "27943247207432",
                        "f50:acctCurr": "USD,CNY,JPY"
                    },
                    {
                        "f50:acctNo": "28563235407555",
                        "f50:acctCurr": "USD,CNY,JPY,HKD" 
                    },
                    {
                        "f50:acctNo": "29373245567117",
                        "f50:acctCurr": "USD,CNY,JPY,HKD,EUR" 
                    }
                ]
            },
            "f50:trnsToken": "8a80a7c72fb4d763012fb5053a000065"
        }
    }
};

//外幣保費資料查詢(未辦理過)
export const f5000201_res_02 = {
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
            "@xmlns:f50": "http://mnb.hitrust.com/service/schema/F5000201",
            "@xsi:type": "f50:F5000201ResultType",

            "f50:hostCode": "尚未約定繳付外幣保費功能，請洽本行各營業單位辦理",
            "f50:hostCodeMsg": "",
            "f50:trnsRsltCode": "1",
        }
    }
};
