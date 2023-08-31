export const f4000102_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"resHeader": {
			"requestNo": "8cdc3aa0be8404e075070cb7-f1000102",
			"requestTime": "2019-03-25T18:37:44.777+08:00",
			"responseTime": "2019-03-25T18:37:44.777+08:00",
			"custId": null
		},

		"result": {
			"@xsi:type": "f40:f4000102ResultType",
			"@xmlns:f40": "http://mnb.hitrust.com/service/schema/f4000102",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
			"f40:custId": "",
			"f40:hostCode": "4001",
			"f40:trnsNo": "9378164839201948",
			"f40:trnsDateTime": "2019-08-29T09:37:44.777+08:00",
			"f40:recordDate": "1080829",
			"f40:trnsfrOutAccnt": "0645899300865",
			"f40:trnsfrInBank": "006",
			"f40:trnsfrInBankName": "合作金庫商業銀行",
			"f40:trnsfrInAccnt": "0560766501082",
			"f40:trnsfrAmount": "123",
			"f40:trnsfrFee": "0",
			"f40:trnsfrOutAccntBal": "699877",
			// "f40:notePayer": "111",
			"f40:notePayer": "",
			"f40:notePayee": "222",
			"f40:hostCodeMsg": "交易成功",
			//0-交易成功  1-交易失敗  X-交易異常
			"f40:trnsRsltCode": "0"
			// "f40:trnsRsltCode": "1"
			// "f40:trnsRsltCode": "X"
		}
	}
};
