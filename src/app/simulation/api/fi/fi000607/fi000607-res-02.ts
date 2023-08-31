// export const fi000607_res_02 = {
//   'MNBResponse': {
//     '@xmlns': 'http://mnb.hitrust.com/service/schema',
//     '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
//     'resHeader': {
//        'requestNo': '4b492598281d534755371d80-f1000101',
//        'requestTime': '2019-03-22T10:12:22.571+08:00',
//        'responseTime': '2019-03-22T10:12:26.721+08:00',
//        'custId': 'B121194483'
//     },
//     'failure': {
//      'debugMessage': '伺服器憑證錯誤',
//      'certCheck': 'Error',
//     }
//  }
// };
export const fi000607_res_02 = {
  'MNBResponse': {
    '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
      'requestNo': '8cdc3aa0be8404e075070cb7-fi000607',
      'requestTime': '2019-03-25T18:37:44.777+08:00',
      'responseTime': '2019-03-25T18:37:44.777+08:00',
      'custId': null
    },

    'result': {
      '@xsi:type': 'fi0:fi000607ResultType',
      '@xmlns:fi0': 'http://mnb.hitrust.com/service/schema/fi000607',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

      'fi0:custId': 'B121194483',
      'fi0:act': '2',
      'fi0:condition': null,
      'fi0:modifyDate': '20190606',
      'fi0:trnsRsltCode': '0',
      'fi0:hostCode': '4001',
      'fi0:hostCodeMsg': '交易成功',
    }
  }
};

