export const fh000101_res_01 = {
  "MNBResponse" : {
	"@xmlns:sch" : "http://mnb.hitrust.com/service/schema",
    "resHeader": {
		"requestNo": "8cdc3aa0be8404e075070cb7-f1000103",
		"requestTime": "2019-03-25T18:37:44.777+08:00",
		"responseTime": "2019-03-25T18:37:44.777+08:00",
		"custId": null
	  },
  
	"result" : {
	  "@xsi:type" : "fh0:fh000101ResultType",
	  "@xmlns:fh0" : "http://mnb.hitrust.com/service/schema/fh000101",
		"@xmlns:xsi" : "http://www.w3.org/2001/XMLSchema-instance",
		"fh0:custId" : "B121194483",
		"fh0:trnsAcctNo" : "1212121211112",
	  "fh0:trnsOutAccts" : {
		"fh0:detail" : [
			{
				"fh0:acctNo" : "2233445678900"
			},
			{
				"fh0:acctNo" : "1212121211112"
			},
			{
				"fh0:acctNo" : "4215521277183"
			},
			{
				"fh0:acctNo" : "3615772277556"
			},
			{
				"fh0:acctNo" : "7745994271126"
			}
		]
	  }
	}
  }
};