/**
 * [模擬]台幣綜存彙總
 */
export const f2100106_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"resHeader": {
			"requestNo": "8cdc3aa0be8404e075070cb7-f1000502",
			"requestTime": "2019-03-25T18:37:44.777+08:00",
			"responseTime": "2019-03-25T18:37:44.777+08:00",
            "custId": "B1202812720l"
		},

		"result": {
			"@xsi:type": "f21:f2100106ResultType",
			"@xmlns:f21": "http://mnb.hitrust.com/service/schema/f2100106",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "f21:realBalance": "100",
            "f21:usefulBalance": "200",
            "f21:afterFDBalance": "300",
            "f21:toFDAmt": "400",
            "f21:todayCheckBalance": "500",
            "f21:tomCheckBalance": "600",
            "f21:icCard": "700",
            "f21:freezeBalance": "800",
            "f21:distrainBalance": "900",
            "f21:afterRunBalance": "1000",
            "f21:afterRunPay": "1100",
		}
	}
};
