export const FQ000501_res_01 = {
	'MNBResponse': {
		'@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
		'resHeader': {
			'requestNo': '1481860700840-fq000501',
			'requestTime': '2016-12-13T18:27:40.500+08:00',
			'responseTime': '2016-12-13T18:27:40.671+08:00',
			'custId': ''
		},
		'result': {
			'@xmlns:fq0': 'http://mnb.hitrust.com/service/schema/fq000501',
			'@xsi:type': 'fq0:fq000501ResultType',
			'fq0:trnsRsltCode': '0',
			'fq0:hostCode': '',
			'fq0:powerInfo': "{\"rtnCode\":0,\"para0\":\"A1234567892\",\"para1\":\"0\",\"para2\":[{\"para0\":\"10802\",\"para1\":\"1080715\",\"para2\":\"1\",\"para3\":161,\"para4\":\"88\"},{\"para0\":\"10802\",\"para1\":\"1080705\",\"para2\":\"F\",\"para3\":887,\"para4\":\"\"}]}",
			'fq0:hostCodeMsg': '',
			'fq0:type': '0',
			'fq0:typeAndFee': 'F1',
			'fq0:feeSessionId': 'feeSessionId fq000501',
			'fq0:rtnCode': '0',
			'fq0:electricNo': 'A1234567892',
			'fq0:canPayment': '0',
			'fq0:trnsToken': 'FQ000501 res trnsToken',
			'fq0:details': {
				'fq0:detail': [
					{
						"billDate": "10801",
						"chargeDate": "1080115",
						"feeType": "1",
						"chargeAmt": "1",
						"degrees": "000000000012"
					}, {
						"billDate": "10502",
						"chargeDate": "1050205",
						"feeType": "1",
						"chargeAmt": "1000000",
						"degrees": '123456789012'
					},
					{
						"billDate": "10803",
						"chargeDate": "1080315",
						"feeType": "F",
						"chargeAmt": "300",
						"degrees": "88"
					},
					{
						"billDate": "10804",
						"chargeDate": "1080405",
						"feeType": "J",
						"chargeAmt": "4000",
						"degrees": '000000002135'
					}
				]
			}
		}
	}
};