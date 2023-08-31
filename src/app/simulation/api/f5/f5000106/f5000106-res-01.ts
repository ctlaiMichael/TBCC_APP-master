//外幣活存預約轉帳查詢
export const f5000106_res_01 = {
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
            "@xmlns:f50": "http://mnb.hitrust.com/service/schema/F5000106",
            "@xsi:type": "f50:F5000106ResultType",


            "f50:trnsToken": "8a80a7c72fb4d763012fb5053a000065",
            "f50:hostCode": "4001",
            "f50:hostCodeMsg": "交易成功",
            "f50:trnsRsltCode": "0",
            "f50:details": {
                "f50:detail": [
                    {
                        "f50:orderDate": "100/06/15",
                        "f50:orderNo": "00013241132",
                        "f50:trnsfrDate": "100/06/30",
                        "f50:trnsfrOutAccnt": "9997227270150",
                        "f50:trnsfrInAccnt": "0009998227068594",
                        "f50:trnsfrAmount": "1000.00",
                        "f50:trnsfrCurr": "USD",
                        "f50:subType": "A",
                        "f50:note": "備註",
                        "f50:status": "0",
                    }
                ]
            }
        }
    }
}
