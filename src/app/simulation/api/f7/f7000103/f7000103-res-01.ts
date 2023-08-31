export const f7000103_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"resHeader": {
			"requestNo": "8cdc3aa0be8404e075070cb7-f7000103",
			"requestTime": "2019-03-25T18:37:44.777+08:00",
			"responseTime": "2019-03-25T18:37:44.777+08:00",
			"custId": null
		},

		"result": {
			"@xmlns:f70": "http://mnb.hitrust.com/service/schema/f7000103",
			"@xsi:type": "f70:f7000103ResultType",
			"f70:custId": "B120281272",
			"f70:businessType": "T",
			"f70:trnsToken": "8a80a7c72fb4d763012fb5053a000065",
			"f70:trnsOutAccts": {
				"f70:detail": [
					{ "f70:acctNo": "0765998123456" }
					// ,
					// { "f70:acctNo": "0345998654321" },
					// { "f70:acctNo": "0891453500123" }
				]
			},

			// 錯誤案例
			// "f70:trnsOutAccts": null,

			"f70:taxId": "11111",
			"f70:startDate": "0101",
			"f70:endDate": "1201",
			"f70:taxs": {
				"f70:detail": [
					{
						"f70:atmCode": "10001",
						"f70:subName": "小型自用客車",
					},
					{
						"f70:atmCode": "20002",
						"f70:subName": "中型自用客車",
					},
					{
						"f70:atmCode": "30003",
						"f70:subName": "大型自用客車",
					}
					// ,
					// {
					// 	"f70:atmCode": "40005",
					// 	"f70:subName": "汽機車燃料使用費",
					// }
				]
			}
		}
	}
}
