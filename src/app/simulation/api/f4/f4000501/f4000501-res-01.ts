export const f4000501_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"resHeader": {
			"requestNo": "8cdc3aa0be8404e075070cb7-f1000501",
			"requestTime": "2019-03-25T18:37:44.777+08:00",
			"responseTime": "2019-03-25T18:37:44.777+08:00",
			"custId": null
		},

		"result": {
			"@xsi:type": "f40:f4000501ResultType",
			"@xmlns:f40": "http://mnb.hitrust.com/service/schema/f4000501",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
			"f40:trnsToken": "2eb6c9a880c6423688fc8faa486550a3",
			"f40:details": 
			// null 測試
			// null
			{
				"f40:detail": [
					{
						"f40:orderDate": "1000615",
						"f40:orderNo": "0001",
						"f40:trnsfrDate": "1080530",
						"f40:trnsfrOutAccnt": "0645899300865",
						"f40:trnsfrInBank": "006",
						"f40:trnsfrInAccnt": "0009998227068594",
						"f40:trnsfrAmount": "1000",
						"f40:notePayer": "生活用品",
						"f40:notePayee": "限合作金庫才可填寫此備註",
						"f40:status": "S",
						"f40:statusDesc": "轉帳成功"
					},
					{
						"f40:orderDate": "1000615",
						"f40:orderNo": "0001",
						"f40:trnsfrDate": "1080630",
						"f40:trnsfrOutAccnt": "0645899300865",
						"f40:trnsfrInBank": "700",
						"f40:trnsfrInAccnt": "0009998227068594",
						"f40:trnsfrAmount": "6000",
						"f40:notePayer": "轉帳6000至中華郵政",
						"f40:notePayee": "",
						"f40:status": "1",
						"f40:statusDesc": "處理中"
					},
					{
						"f40:orderDate": "1000615",
						"f40:orderNo": "0001",
						"f40:trnsfrDate": "1080430",
						"f40:trnsfrOutAccnt": "0645899300865",
						"f40:trnsfrInBank": "006",
						"f40:trnsfrInAccnt": "0009998227068594",
						"f40:trnsfrAmount": "1000",
						"f40:notePayer": "房貸",
						"f40:notePayee": "限合作金庫才可填寫此備註",
						// null 判斷
						// "f40:notePayer": null,
						// "f40:notePayee": null,
						"f40:status": "0",
						"f40:statusDesc": "未處理"
					},
					{
						"f40:orderDate": "1000615",
						"f40:orderNo": "0001",
						"f40:trnsfrDate": "1080430",
						"f40:trnsfrOutAccnt": "0645899300865",
						"f40:trnsfrInBank": "700",
						"f40:trnsfrInAccnt": "0009998227068594",
						"f40:trnsfrAmount": "2000",
						"f40:notePayer": "轉帳2000至中華郵政",
						"f40:notePayee": "",
						"f40:status": "F",
						"f40:statusDesc": "轉帳失敗"
					}

					// null 測試
					// null
				]
			}
		}
	}
};
