export const f9000502_res_01 = {
	//未完成
	"MNBResponse": {
		"@xmlns:": "http://mnb.hitrust.com/service/schema",
		"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"resHeader": {
			"requestNo": "2019_11_11_15_43_21_666_777777777777777777777",
			"requestTime": "2019-11-09T13:32:21.578+08:00",
			"responseTime": "2010-11-10T13:32:21.750+08:00",
			"custId": null
		},
		"result": {
			"@xmlns:f90": "http://mnb.hitrust.com/service/schema/f9000502",
			"@xsi:type": "f90:f9000502ResultType",

			"custId": "B121194483",
			"result":'0', // 0:成功,1:表示失敗，需由Failure element取得錯誤代碼及訊息。
			"respCode": "4001",
			"respCodeMsg": "電文成功"
		}
	}
};
