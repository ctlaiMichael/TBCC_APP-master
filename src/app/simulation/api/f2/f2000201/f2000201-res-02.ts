// acctNo	帳號
// openBranchId	開戶分行代碼
// openBranchName	開戶分行名稱
// acctType	存款類別代碼
// acctTypeName	存款類別名稱
// currCode	幣別代碼
// currency	幣別
// currName	幣別名稱
// balance	餘額
// lastTrnsDate	最後交易日/定存到期日


// 20191023 APP外匯存款轉帳問題
// 建立資料測試

export const f2000201_res_02 = {
	"MNBResponse": {
		"@xmlns:": "http://mnb.hitrust.com/service/schema",
		"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"resHeader": {
			"requestNo": "8cdc3aa0be8404e075070cb7-f1000103",
			"requestTime": "2010-12-22T13:32:21.578+08:00",
			"responseTime": "2010-12-22T13:32:21.750+08:00",
			"custId": null
		},
		"result": {
			"@xmlns:f20": "http://mnb.hitrust.com/service/schema/f2000201",
			"@xsi:type": "f20:f2000201ResultType",

			"f20:details": {
				"f20:detail": [
					{
						"f20:acctNo": "0560999123456",
						"f20:openBranchId": "0320",
						"f20:openBranchName": "合庫鳳山",
						"f20:acctType": "XM",
						"f20:acctTypeName": "外匯綜合存款",
						"f20:currCode": "01",
						"f20:currency": "USD",
						"f20:currName": "美金",
						"f20:balance": "99.99",
						"f20:lastTrnsDate": "1080919"
					},
					{
						"f20:acctNo": "0560999123456",
						"f20:openBranchId": "0320",
						"f20:openBranchName": "合庫鳳山",
						"f20:acctType": "XM",
						"f20:acctTypeName": "外匯綜合存款",
						"f20:currCode": "30",
						"f20:currency": "CNY",
						"f20:currName": "人民幣",
						"f20:balance": "78.23",
						"f20:lastTrnsDate": "1080831"
					}
				]
			},
			"paginatedInfo": {
				"totalRowCount": "2"
				, "pageSize": "500"
				, "pageNumber": "1"
				, "sortColName": null
				, "sortDirection": "ASC"
			}

		}
	}
};
