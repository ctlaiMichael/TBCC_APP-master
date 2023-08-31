// acctNo	帳號
// openBranchId	開戶分行代碼
// openBranchName	開戶分行名稱
// acctType	存款類別代碼
// acctTypeName	存款類別名稱
// currCode	幣別代碼
// currency	幣別
// currName	幣別名稱
// balance	餘額
// lastTrnsDate	最後交易日/定存到期日

export const fb000705_res_01 = {
  'MNBResponse': {
    '@xmlns:': 'http://mnb.hitrust.com/service/schema',
    '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'resHeader': {
      'requestNo': '2011_01_11_13_22_25_281_12345',
      'requestTime': '2011-01-11T13:22:25.281+08:00',
      'responseTime': '2011-01-11T13:22:25.296+08:00',
      'custId': 'B1202812720'
    },
    'result': {
      '@xmlns:fb0': 'http://mnb.hitrust.com/service/schema/fb000705',
      '@xsi:type': 'fb0:fb000705ResultType',
      'fb0:queryType': '1',
      'fb0:goldAccts': {
        'detail': [
          {
            'fb0:acctNo': '1111590334569',
            'fb0:usefulBalance': '1111.36',
            'fb0:lastTransDay': '1070808',
            'fb0:openBranchId': '9997',
            'fb0:openBranchIdName': '9997分行'
          },
          {
            'fb0:acctNo': '2222590334569',
            'fb0:usefulBalance': '2222.36',
            'fb0:lastTransDay': '1070808',
            'fb0:openBranchId': '9997',
            'fb0:openBranchIdName': '9997分行'
          },
          {
            'fb0:acctNo': '3333590334569',
            'fb0:usefulBalance': '3333.36',
            'fb0:lastTransDay': '1070808',
            'fb0:openBranchId': '9997',
            'fb0:openBranchIdName': '9997分行'
          }
        ]
      }
    }
  }
};
