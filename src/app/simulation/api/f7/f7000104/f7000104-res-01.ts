export const f7000104_res_01 = {
	"MNBResponse": {
	"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
	"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
	"resHeader": {
		"requestNo": "8cdc3aa0be8404e075070cb7-f7000104",
		"requestTime": "2019-05-13T08:37:44.777+08:00",
		"responseTime": "2019-05-13T14:37:44.777+08:00",
		"custId": null
	},
	
	"result": {
		"@xmlns:f70": "http://mnb.hitrust.com/service/schema/f7000104",
		"@xsi:type": "f70:f7000104ResultType",
		"f70:custId": "B1202812720",
		"f70:businessType": "T",
		"f70:trnsToken": "8a80a7c72fb4d763012fb5053a000065",
		"f70:trnsOutAccts": {
		"f70:detail": [
			{ "f70:acctNo": "0645899300865" }
			// ,
			// { "f70:acctNo": "3456899300865" },
			// { "f70:acctNo": "7777899300865" },
			// { "f70:acctNo": "1111899300865" }
		]
		}


		// 錯誤案例
		// "f70:trnsOutAccts":null
	}
	}
}
