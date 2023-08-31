// 外匯綜活轉綜定利率查詢
export const f6000302_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"resHeader": {
            "requestNo": "2010_12_22_13_32_21_531_12345",
            "requestTime": "2010-12-22T13:32:21.578+08:00",
            "responseTime": "2010-12-22T13:32:21.750+08:00",
			"custId": null
		},

		"result": {
			"@xsi:type": "f60:f6000302ResultType",
			"@xmlns:f60": "http://mnb.hitrust.com/service/schema/f6000302",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "f60:currency": "USD",
            "f60:currencyDesc": "美元",
            "f60:transfrTimes": "00",
            "f60:transfrTimesDesc": "一星期",
            "f60:intrstRate": "0.2700"
		}
	}
};
