export const fc001001_res_01 = {
  'MNBResponse': {
    '@xmlns': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
      'requestNo': '1481860700840-fc001001',
      'requestTime': '2011-01-13T18:27:40.500+08:00',
      'responseTime': '2011-01-13T18:27:40.671+08:00',
      'custId': ''
    },
    'result': {
      '@xmlns:fc0': 'http://mnb.hitrust.com/service/schema/fc001001',
      '@xsi:type': 'fc0:fc001001ResultType',
      'result': '0',
      'respCode': 'M0001',
      'respCodeMsg': '申請成功',
      'details': {
        'detail': [
          {
            'creditCardNo': '666666',
            'payableAmt': '100',
            'lowestPayableAmt': '50',
            'usableAmt': '80'
          },
          {
            'creditCardNo': '777777',
            'payableAmt': '200',
            'lowestPayableAmt': '70',
            'usableAmt': '90'
          },
        ],
      },
      'paginatedInfo': {
        'totalRowCount': '10',
        'pageSize': '2',
        'pageNumber': '1',
        'sortColName': 'creditCardNo',
        'sortDirection': 'ASC'
      },
    }
  }
};

