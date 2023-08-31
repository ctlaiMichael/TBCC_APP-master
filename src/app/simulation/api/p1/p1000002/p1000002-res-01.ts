export const p1000002_res_01 = {
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
        'errCode': '',
        'details': {
          // 單筆時不是陣列
          // 'detail': {
          //   "id": "97",
          //   "currency": "AUD",
          //   "type": "TWDExchange",
          //   "exchangeType": "PROMPT",
          //   "condition": "Big",
          //   "exchange": "111",
          //   "frequency": "0"
          // }
  
          'detail': [
            {
              'id': '65',
              'currency': 'HKD',
              'type': 'ForeignExchange',
              'exchangeType': 'PROMPT',
              'condition': 'Big',
              'exchange': '30.1',
              'frequency': '0'
            }, {
              'id': '67',
              'currency': 'HKD',
              'type': 'ForeignExchange',
              'exchangeType': 'PROMPT',
              'condition': 'Big',
              'exchange': '32.1',
              'frequency': '0'
            }, {
              'id': '66',
              'currency': 'USD',
              'type': 'TWDExchange',
              'exchangeType': 'CASH',
              'condition': 'Small',
              'exchange': '123.6',
              'frequency': '99'
            }, {
              'id': '12',
              'currency': 'AUD',
              'type': 'TWDExchange',
              'exchangeType': 'PROMPT',
              'condition': 'Small',
              'exchange': '22.6',
              'frequency': '99'
            }
          ]
  
        }
      }
    }
  };