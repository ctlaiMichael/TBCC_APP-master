// 台外幣轉帳約定帳號查詢

// 20191023 APP外匯存款轉帳問題
// 建立資料測試

export const f5000101_res_02 = {
    "MNBResponse": {
        "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "2010_12_22_13_32_21_531_12345",
            "requestTime": "2010-12-22T15:32:21.578+08:00",
            "responseTime": "2010-12-22T15:32:21.750+08:00",
            "custId": null
        },
        "result": {
            "@xmlns:f50": "http://mnb.hitrust.com/service/schema/F5000101",
            "@xsi:type": "f50:F5000101ResultType",
            "f50:businessType": "Y",
            "f50:trnsToken": "8a80a7c72fb4d763012fb5053a000065",
            "f50:trnsOutAccts":
            {
                "f50:trnsOutAcct": [
                    {
                        "f50:trnsfrOutAccnt": "0560999123456",
                        "f50:trnsOutCurr": "USD,CNY",
                        "f50:trnsfrOutName": "王****"

                    }
                ]
            }
            ,
            "f50:trnsInAccts":
            {
                "f50:trnsInAcct": [
                    {
                        "f50:trnsfrInAccnt": "9999777654321",
                        "f50:trnsfrInId": "S2******44",
                        "f50:trnsfrInNam": "xsi:nil=true",
                        "f50:trnsInCurr": "USD,HKD,GBP,AUD,SGD,CHF,CAD,JPY,SEK,EUR,NZD,THB,ZAR,CN",
                        "f50:trnsInSetType": "1",
                        "f50:acctNickName" :"xsi:nil=true"
                    },{
                        "f50:trnsfrInAccnt":"0666777987543",
                        "f50:trnsfrInId":"S22*****55",
                        "f50:trnsfrInName": "xsi:nil=true",
                        "f50:trnsInCurr":"USD,HKD,GBP,AUD,SGD,CHF,CAD,JPY,SEK,EUR,NZD,THB,ZAR,CNY",
                        "f50:trnsInSetType":"1",
                        "f50:acctNickName" :"xsi:nil=true"
                    },
                    {
                        "f50:trnsfrInAccnt":"0560999123456",
                        "f50:trnsfrInId":"E22*****99",
                        "f50:trnsfrInName": "xsi:nil=true",
                        "f50:trnsInCurr":"USD,HKD,GBP,AUD,SGD,CHF,CAD,JPY,SEK,EUR,NZD,THB,ZAR,CNY",
                        "f50:trnsInSetType":"1",
                        "f50:acctNickName" :"xsi:nil=true"
                    }
                ]
            }
            ,
            // "f50:trnsInAccts":null,
            "f50:trnsCurrs": {
                "f50:trnsCurr": [
                    {
                        "f50:trnsCurrId": "USD",
                        "f50:trnsCurrDesc": "美金",
                        "f50:trnsCurrCode": "01",
                    }
                ]
            }


        }
    }
};
