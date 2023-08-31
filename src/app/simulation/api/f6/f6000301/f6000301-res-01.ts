// 外匯綜活轉綜定
export const f6000301_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"resHeader": {
			"requestNo": "8cdc3aa0be8404e075070cb7-f1000502",
			"requestTime": "2019-03-25T18:37:44.777+08:00",
			"responseTime": "2019-03-25T18:37:44.777+08:00",
			"custId": null
		},

		"result": {
			"@xsi:type": "f60:f6000301ResultType",
			"@xmlns:f60": "http://mnb.hitrust.com/service/schema/f6000301",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "f60:custId": "B1202812720",
            "f60:hostCode": "4001",
            "f60:trnsNo": "1111",
            "f60:trnsDateTime": "9990101000000",
            "f60:hostCodeMsg": "1111",
            "f60:trnsfrOutAccnt": "轉出帳號",
            "f60:trnsfrOutCurr": "USD",
            "f60:trnsfrOutCurrDesc": "美元",
            "f60:trnsfrOutAccntBal": "3000",
            "f60:trnsfrAmount": "1000",
            "f60:trnsfrInAccnt": "轉入定存帳號",
            "f60:transfrTimes": "00",
            "f60:transfrTimesDesc": "一星期",
            "f60:autoTransCode": "1",
            "f60:autoTransCodeDesc": "到期本金續存，利息入綜活存",
            "f60:intrstRate": "0.2700",
            "f60:trnsRsltCode": "0",
            "f60:computeIntrstType": "1",
            "f60:computeIntrstTypeDsc": "按月領息"
		}
	}
};
