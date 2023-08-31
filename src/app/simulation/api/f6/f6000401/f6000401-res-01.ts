// 外幣綜定存歸戶查詢
export const f6000401_res_01 = {
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
            "@xmlns:f60": "http://mnb.hitrust.com/service/schema/f6000401",
            "@xsi:type": "f60:F6000401ResultType",

            "f60:details": {
                "f60:detail": [
                    {
                        "f60:account": "0796-899-300865",
                        "f60:currency": "01",
                        "f60:currencyEng": "USD",
                        "f60:balance": "1000.00",
                        "f60:startAccountDay": "1000620",
                        "f60:endAccountDay": "1000720",
                        "f60:autoTransType": "外定-一星期",
                        "f60:autoTransSet": "本金-到期日",
                        "f60:autoTransNum": "06",
                        "f60:mBAccNo": "綜存帳號",
                        "f60:computeIntrstType": "1",
                        "f60:computeIntrstTypeDsc": "按月領息",
                    },
                    {
                        "f60:account": "0796-899-300865",
                        "f60:currency": "01",
                        "f60:currencyEng": "USD",
                        "f60:balance": "1000.00",
                        "f60:startAccountDay": "1000620",
                        "f60:endAccountDay": "1000720",
                        "f60:autoTransType": "外定-一個月",
                        "f60:autoTransSet": "本金-到期日",
                        "f60:autoTransNum": "06",
                        "f60:mBAccNo": "綜存帳號",
                        "f60:computeIntrstType": "5",
                        "f60:computeIntrstTypeDsc": "到期領息",
                    },
                    {
                        "f60:account": "0796-899-300865",
                        "f60:currency": "01",
                        "f60:currencyEng": "USD",
                        "f60:balance": "1000.00",
                        "f60:startAccountDay": "1000620",
                        "f60:endAccountDay": "1000720",
                        "f60:autoTransType": "外定-三個月",
                        "f60:autoTransSet": "本息-到期日",
                        "f60:autoTransNum": "06",
                        "f60:mBAccNo": "綜存帳號",
                        "f60:computeIntrstType": "1",
                        "f60:computeIntrstTypeDsc": "按月領息",
                    },
                    {
                        "f60:account": "0796-899-300865",
                        "f60:currency": "01",
                        "f60:currencyEng": "USD",
                        "f60:balance": "1000.00",
                        "f60:startAccountDay": "1000620",
                        "f60:endAccountDay": "1000720",
                        "f60:autoTransType": "外定-九個月",
                        "f60:autoTransSet": "本金-寬緩期屆滿日",
                        "f60:autoTransNum": "06",
                        "f60:mBAccNo": "綜存帳號",
                        "f60:computeIntrstType": "1",
                        "f60:computeIntrstTypeDsc": "按月領息",
                    },
                    {
                        "f60:account": "0796-899-300865",
                        "f60:currency": "01",
                        "f60:currencyEng": "USD",
                        "f60:balance": "1000.00",
                        "f60:startAccountDay": "1000620",
                        "f60:endAccountDay": "1000720",
                        "f60:autoTransType": "外定-一年",
                        "f60:autoTransSet": "本息-寬緩期屆滿日",
                        "f60:autoTransNum": "06",
                        "f60:mBAccNo": "綜存帳號",
                        "f60:computeIntrstType": "5",
                        "f60:computeIntrstTypeDsc": "到期領息",
                    }
                ]
            }
        }
    }
};
