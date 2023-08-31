
// export const fi000605_res_01 = {
//     'MNBResponse': {
//       '@xmlns': 'http://mnb.hitrust.com/service/schema',
//       '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
//       'resHeader': {
//          'requestNo': '4b492598281d534755371d80-f1000101',
//          'requestTime': '2019-03-22T10:12:22.571+08:00',
//          'responseTime': '2019-03-22T10:12:26.721+08:00',
//          'custId': 'B121194483'
//       },
//       'failure': {
//        'debugMessage': '伺服器憑證錯誤',
//        'certCheck': 'Error',
//       }
//    }
// };
export const fi000605_res_01 = {
  'MNBResponse': {
    '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
      'requestNo': '8cdc3aa0be8404e075070cb7-f1000103',
      'requestTime': '2019-03-25T18:37:44.777+08:00',
      'responseTime': '2019-03-25T18:37:44.777+08:00',
      'custId': null
    },

    'result': {
      '@xsi:type': 'fh0:fh000301ResultType',
      '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fh000301',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

      'custId': 'B1202812720',
      'setFlag': 'Y',
      'details': {
        'detail': [
          {
            'capital': '0.00',
            'currency': 'TWD',
            'fundCode': '5311',
            'fundName': '匯豐新鑽動力基金',
            'incomeState': '0.00',
            'reward': '0.00',
            'tradeNo': 'CA000151712',
            'trustAcnt': null

          },
          {
            'capital': '53.42',
            'currency': 'EUR',
            'fundCode': '0111',
            'fundName': '景順全歐洲企業基金歐元',
            'incomeState': '+167169.74',
            'reward': '+312934.74',
            'tradeNo': 'YA001000160',
            'trustAcnt': null
          },
          {
            'capital': '10000.00',
            'currency': 'TWD',
            'fundCode': '0202',
            'fundName': '摩根東協基金美元',
            'incomeState': '+283.00',
            'reward': '+2.83',
            'tradeNo': 'NB001000012',
            'trustAcnt': null
          }
        ]
      },
      'paginatedInfo': {
        'totalRowCount': '7',
        'pageSize': '2',
        'pageNumber': '1',
        'sortColName': 'applyDateTime',
        'sortDirection': 'DESC'
      }

    }
  }
};

