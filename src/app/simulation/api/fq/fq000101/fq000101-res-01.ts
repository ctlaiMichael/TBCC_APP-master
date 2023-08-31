export const fq000101_res_01 = {
	'MNBResponse': {
		'@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
		'resHeader': {
			'requestNo': '1481860700840-fb000101',
			'requestTime': '2016-12-13T18:27:40.500+08:00',
			'responseTime': '2016-12-13T18:27:40.671+08:00',
			'custId': ''
		},
		'result': {
			'@xmlns:fq0': 'http://mnb.hitrust.com/service/schema/fq000101',
			'@xsi:type': 'fq0:fq000101ResultType',
			'fq0:trnsRsltCode': '0',
			'fq0:hostCode': '交易成功',
			'fq0:hostCodeMsg': '',
			'fq0:isAgreeQRCode': 'Y',
			'fq0:defaultTrnsOutAcct': '0560766500698',
			'fq0:trnsLimitAmt': '5000000',
			// 'fq0:mobileBarcode': '123412341234',
			'fq0:mobileBarcode': '/QQDLLN2',
			'fq0:loveCode': '123414124',
			'fq0:socialWelfareName': '愛心機構',
			'fq0:defaultBarcode': '1',
			'fq0:defaultTrnsCard': '4057590010048209',
			// 'fq0:defaultTrnsCard': null,
			'fq0:trnsOutAccts': {
				'fq0:trnsOutAcct': [
					{
						'fq0:acctNo': '9997705073012',
						'fq0:enabledSmartPay': 'Y',
					},
					{
						'fq0:acctNo': '9997705073011',
						'fq0:enabledSmartPay': 'Y',
					},
					{
						'fq0:acctNo': '9997705073010',
						'fq0:enabledSmartPay': 'Y',
					},
					{
						'fq0:acctNo': '9997705073009',
						'fq0:enabledSmartPay': 'Y',
					},
				]
			}
		}
	}
};