//台外幣轉帳約定帳號查詢
export const f5000101_res_01 = {
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
            // null
            {
                "f50:trnsOutAcct": [
                    {
                        "f50:trnsfrOutAccnt": "9997886501155",
                        "f50:trnsOutCurr": "USD,TWD,EUR",
                        "f50:trnsfrOutName": "王小明"

                    }
                    // ,
                    // {
                    //     "f50:trnsfrOutAccnt": "0340778500171",
                    //     "f50:trnsOutCurr": "TWD,EUR",
                    //     "f50:trnsfrOutName": "陳大明"

                    // }
                    // ,
                    // {
                    //     "f50:trnsfrOutAccnt": "7777888123456",    // 可用餘額:null
                    //     "f50:trnsOutCurr": "USD,TWD,EUR",
                    //     "f50:trnsfrOutName": "流川楓"

                    // },
                    // {
                    //     "f50:trnsfrOutAccnt": "7777888654321",   // 可用餘額:undefined
                    //     "f50:trnsOutCurr": "TWD",
                    //     "f50:trnsfrOutName": "動主播"

                    // },
                    // {
                    //     "f50:trnsfrOutAccnt": "1301322222230",
                    //     "f50:trnsOutCurr": "USD,EUR,HKD",
                    //     "f50:trnsfrOutName": "陳老吉"
                    // },
                    // {
                    //     "f50:trnsfrOutAccnt": "0601322223315",
                    //     "f50:trnsOutCurr": "USD,AUD",
                    //     "f50:trnsfrOutName": "林小華"
                    // },
                    // {
                    //     "f50:trnsfrOutAccnt": "0796899301545",
                    //     "f50:trnsOutCurr": "USD,GBP,JPY",
                    //     "f50:trnsfrOutName": "周小琳"
                    // }
                ]
            }
            ,
            "f50:trnsInAccts":
            //  null
            {
            "f50:trnsInAcct": [
                {
                    "f50:trnsfrInAccnt": "0660766500720",
                    "f50:trnsfrInId": "A112233445",
                    "f50:trnsfrInName": "Kevin",
                    "f50:trnsInCurr": "USD,EUR,TWD",
                    "f50:trnsInSetType": "2"
                },
                // {
                //     "f50:trnsfrInAccnt": "0760766500721",
                //     "f50:trnsfrInId": "B121194483",
                //     "f50:trnsfrInName": "Jack",
                //     "f50:trnsInCurr": "TWD",
                //     "f50:trnsInSetType": "2"
                // },
                // {
                //     "f50:trnsfrInAccnt": "0760766500722",
                //     "f50:trnsfrInId": "B121194483",
                //     "f50:trnsfrInName": "Jack",
                //     "f50:trnsInCurr": "TWD",
                //     "f50:trnsInSetType": "2"
                // },
                // {
                //     "f50:trnsfrInAccnt": "0760766500723",
                //     "f50:trnsfrInId": "B121194483",
                //     "f50:trnsfrInName": "Jack",
                //     "f50:trnsInCurr": "TWD",
                //     "f50:trnsInSetType": "2"
                // },
                {
                    "f50:trnsfrInAccnt": "0760766500724",
                    "f50:trnsfrInId": "B121194483",
                    "f50:trnsfrInName": "Jack",
                    "f50:trnsInCurr": "USD,EUR,JPY",
                    "f50:trnsInSetType": "2"
                },
                // {
                //     "f50:trnsfrInAccnt": "0860766500725",
                //     "f50:trnsfrInId": "G123456789",
                //     "f50:trnsfrInName": "George",
                //     "f50:trnsInCurr": "USD,EUR,HKD",
                //     "f50:trnsInSetType": "2"
                // },
                // {
                //     "f50:trnsfrInAccnt": "0960766500726",
                //     "f50:trnsfrInId": "C213546987",
                //     "f50:trnsfrInName": "Hank",
                //     "f50:trnsInCurr": "USD,EUR,ZAR,CNY",
                //     "f50:trnsInSetType": "2"

                // }
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
