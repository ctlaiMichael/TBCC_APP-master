//信用卡轉出帳號
export const f8000402_res_01 = {
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
            "@xmlns:f80": "http://mnb.hitrust.com/service/schema/F8000402",
            "@xsi:type": "f80:F8000402ResultType",

            "custId": "B121194483",
            "businessType": "N",
            "trnsToken": "8a80a7c72fb4d763012fb5053a000065",
            "trnsOutAccts": {
                "detail": [
                    { "acctNo": "0500765761746" },
                    { "acctNo": "0560766500957" },
                    { "acctNo": "0560766501201" },
                    { "acctNo": "0560766500990" },
                    { "acctNo": "0560766500698" },
                    { "acctNo": "0560766501074" },
                    { "acctNo": "0560766500701" },
                    { "acctNo": "0560766501082" },
                    { "acctNo": "0560766500710" },
                    { "acctNo": "0560766501091" },
                    { "acctNo": "0560766500868" },
                    { "acctNo": "0560766501112" },
                    { "acctNo": "0560766500931" },
                    { "acctNo": "0560766501171" },
                    { "acctNo": "9997227270150" },
                    { "acctNo": "9997227690019" },
                    { "acctNo": "0560765000110" },
                    { "acctNo": "9997765980523" }
                ]
            }
        }
    }
};
