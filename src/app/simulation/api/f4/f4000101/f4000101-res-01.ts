export const f4000101_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"resHeader": {
			"requestNo": "8cdc3aa0be8404e075070cb7-f1000101",
			"requestTime": "2019-08-29T07:59:00.777+08:00",
			"responseTime": "2019-08-29T09:59:50.777+08:00",
			"custId": null
		},

		"result": {
			"@xsi:type": "f40:f4000101ResultType",
			"@xmlns:fh0": "http://mnb.hitrust.com/service/schema/f4000101",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
			"custId": "",
			"businessType": "N",
			"nextBusinessDate": "1020208",
			"trnsToken": "2eb6c9a880c6423688fc8faa486550a3",
			"allowNonAgreeAcctFlag": "Y",
			"NonAgreeAcctListFlag": "N",
			"trnsOutAccts":
			// null 
			{
				"trnsOutAcct": [
					// 轉出帳號(合庫)13碼未加'-'
					{ "acctNo": '0645899300865' }
					// ,
					// { "acctNo": '3456899300865' },
					// { "acctNo": '7777899300865' },
					// { "acctNo": '1111899300865' },
					// { "acctNo": '0560877123456' },  // null
					// { "acctNo": '0560877654321' }   // undefined
					// null
				]
			},
			// 約定轉入帳號(本行長度一定13碼.他行長度不一定，電文回來不補零至16碼)
			"trnsInAccts": //  trnsInSetType ---1:臨櫃約定/2:線上約定
			// null
			{
				"trnsInAcct": [
					{ "bankId": "006", "bankName": "合作金庫商業銀行", "acctNo": "0645899300865", "acctName": { "@xsi:nil": "true" }, "trnsInSetType": "1", "acctNickName": "好記名稱1" },
					{ "bankId": "006", "bankName": "合作金庫商業銀行", "acctNo": "0560766501082", "acctName": { "@xsi:nil": "true" }, "trnsInSetType": "1", "acctNickName": { "@xsi:nil": "true" } },
					{ "bankId": "006", "bankName": "合作金庫商業銀行", "acctNo": "0560766501091", "acctName": "丙一般本國人", "trnsInSetType": "2", "acctNickName": { "@xsi:nil": "true" } },
					{ "bankId": "006", "bankName": "合作金庫商業銀行", "acctNo": "9997717093050", "acctName": "約定帳戶A(13碼.2)", "trnsInSetType": "2", "acctNickName": "好記名稱2" },
					{ "bankId": "807", "bankName": "永豐商業銀行", "acctNo": "3201717093040", "acctName": "約定帳戶B(13碼.1)", "trnsInSetType": "1", "acctNickName": { "@xsi:nil": "true" } },
					{ "bankId": "005", "bankName": "臺灣土地銀行", "acctNo": "01234567890123", "acctName": "約定帳戶C(14碼.2)", "trnsInSetType": "2", "acctNickName": { "@xsi:nil": "true" } },
					{ "bankId": "012", "bankName": "台北富邦商業銀行", "acctNo": "009876543219875", "acctName": "約定帳戶D(15碼.1)", "trnsInSetType": "1", "acctNickName": { "@xsi:nil": "true" } }
				]
			},
			// 常用轉入帳號(本行.他行一定補零至16碼)
			"commonTrnsInAccts": //  commonInSetType ---1:臨櫃約定/2:線上約定/3:非約定帳號
			// null
			{
				"commonTrnsInAcct": [
					{ "bankId": '006', "bankName": '合作金庫商業銀行', "acctNo": '0009997717093050', "acctName": '約定帳戶A', "isAAcct": 'Y',"commonInSetType":'2' },
					{ "bankId": '004', "bankName": '台灣銀行', "acctNo": '0001228825282234', "acctName": '王小明', "isAAcct": 'N',"commonInSetType":'3' },
					{ "bankId": '807', "bankName": '永豐商業銀行', "acctNo": '0003201717093040', "acctName": '約定帳戶B', "isAAcct": 'Y',"commonInSetType":'1' },
					{ "bankId": '008', "bankName": '華南商業銀行', "acctNo": '0023100200220118', "acctName": '花不棄', "isAAcct": 'N',"commonInSetType":'3' },
					{ "bankId": '005', "bankName": '臺灣土地銀行', "acctNo": '0001234567890123', "acctName": '約定帳戶C', "isAAcct": 'Y',"commonInSetType":'2' },
					{ "bankId": '012', "bankName": '台北富邦商業銀行', "acctNo": '0009876543219875', "acctName": '約定帳戶D', "isAAcct": 'Y',"commonInSetType":'1' }
				]
			}
		}
	}
};
