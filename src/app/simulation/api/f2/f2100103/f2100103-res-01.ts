
/**
 * [模擬]台幣活存彙總
 */
export const f2100103_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"resHeader": {
            "requestNo": "2010_12_08_16_22_06_640_12345",
            "requestTime": "2010-12-08T16:22:06.671+08:00",
            "responseTime": "2010-12-08T16:22:06.734+08:00",
            "custId": "B1202812720"
		},

		"result": {
			"@xsi:type": "f21:f2100103ResultType",
			"@xmlns:f21": "http://mnb.hitrust.com/service/schema/f2100103",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "f21:realBalance": "1000",
            "f21:usefulBalance": "2000",
            "f21:todayCheckBalance": "6000",
            "f21:tomCheckBalance": "7000",
            "f21:icCard": "5000",
            "f21:freezeBalance": "8000",
            "f21:distrainBalance": "9000",
            "f21:afterRunBalance": "10000",
            "f21:afterRunPay": "11000",
            "f21:financeRate": "0.000",
            "f21:financeAmount": "1000.00",
			"f21:financeStartDay": "1070101",
			"f21:financeEndDay": "1080325",
		}
	}
};
