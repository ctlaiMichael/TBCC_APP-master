const fi000701_res_A_2_Y = {
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

      'details': {
        'detail': 
        {
          'fundCode': '5401',
          'fundName': '元大多幅基金',
          'investType': 2,
          'investDesc': '小額',
          'iNCurrency': 'TWD',
          'invenAmount': '0.00',
          'transCode': 'CB001004224',
          'debitStatus': null,
          'deleteFlag': 'Y',
          'cost': '000010000'
        }
      },
      'paginatedInfo': {
        'totalRowCount': '1',
        'pageSize': '20',
        'pageNumber': '1',
        'sortColName': 'fundCode',
        'sortDirection': 'DESC'
      }

    }
  }
};

export const fi000701_res_real = {
  'A_2_Y': fi000701_res_A_2_Y
};
