// 外幣綜定存中途解約
export const f6000403_res_01 = {
    "MNBResponse": {
        "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "2010_12_22_13_32_21_531_12345",
            "requestTime": "2010-12-22T13:32:21.578+08:00",
            "responseTime": "2010-12-22T13:32:21.750+08:00",
            "custId": "B1202812720"
        },
        "result": {
            "@xmlns:f60": "http://mnb.hitrust.com/service/schema/f6000403",
            "@xsi:type": "f60:F6000403ResultType",

            "f60:custId": "B1202812720",
            "f60:hostCode": "4001",
            "f60:trnsNo": "1111",
            "f60:trnsDateTime": "",
            "f60:hostCodeMsg": "交易成功",
            "f60:xFaccount": "9997765665555",
            "f60:currencyName": "USD",
            "f60:amount": "2000.00",
            "f60:trnsfrRate": "29.14",
            "f60:startDate": "1000620",
            "f60:maturityDate": "1000720",
            "f60:interestRate": "存單利率",
            "f60:cancelRate": "解約利率",
            "f60:margin": "原幣毛息",
            "f60:tax": "原幣稅",
            "f60:profit": "原幣淨息",
            "f60:total": "原幣解約本息",
            "f60:destAccount": "9997765665555",
            "f60:taxTW": "台幣稅",
            "f60:intTW": "台幣毛息",
            "f60:trnsRsltCode": "0",
            "f60:interestIncome": "按月領息已領息",
            "f60:midInt": "中途解約息",
            "f60:insuAmt": "原幣代扣健保費",
            "f60:insuAmtTw": "臺幣代扣健保費",
            "f60:insuRate": "健保補充保費費率"
        }
    }
};
