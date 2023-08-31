/**
 * [模擬]台幣支存彙總
 */
export const f2100104_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"resHeader": {
			"requestNo": "8cdc3aa0be8404e075070cb7-f1000502",
			"requestTime": "2019-03-25T18:37:44.777+08:00",
			"responseTime": "2019-03-25T18:37:44.777+08:00",
            "custId": "B1202812720l"
		},

		"result": {
			"@xsi:type": "f21:f2100104ResultType",
			"@xmlns:f21": "http://mnb.hitrust.com/service/schema/f2100104",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "f21:realBalance": "100",
            "f21:usefulBalance": "200",
            "f21:todayCheckBalance": "600",
            "f21:tomCheckBalance": "700",
            "f21:icCard": "500",
            "f21:freezeBalance": "800",
            "f21:distrainBalance": "900",
            "f21:afterRunBalance": "1000",
            "f21:afterRunPay": "1100",
            "f21:financeRate": "7.000",
            "f21:financeAmount": "20000.00",
            "f21:financeStartDay": "0890101",
            "f21:financeEndDay": "0910228",
		}
	}
};
