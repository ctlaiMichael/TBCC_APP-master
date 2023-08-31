// export const fi000103_res_01 = {
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

export const fi000103_res_01 = {
  'MNBResponse': {
    '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
      'requestNo': '8cdc3aa0be8404e075070cb7-fi000103',
      'requestTime': '2019-03-25T18:37:44.777+08:00',
      'responseTime': '2019-03-25T18:37:44.777+08:00',
      'custId': null
    },

    'result': {
      '@xsi:type': 'fi0:fi000103ResultType',
      '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fi000103',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

      'custId': 'B121194483',
      'fundCode': '0802',
      'fundName': '富蘭克林坦伯頓成長基金',
      'riskRank': 'RR3',
      'transCode': 'CA000053475',
      'fundType': '國外基金外幣',
      'details': {
        'detail': [
          {
            'investType': '1',
            'investDesc': '單筆',
            'transType': '10',
            'transTypeDesc': '申購',
            'enrollDate': '1080825',
            'iNCurrency': 'USD',
            'vACurrency': 'USD',
            'purchRate': '1.0000',
            'unit1': '20.0000',
            'netValue': '48.3537',
            'purchAmnt': '1000.00',
            'serviceFee1': '4.24',
            'purchTotalAmnt': '1000.00'
          },
          {
            'investType': '1',
            'investDesc': '單筆',
            'transType': '70',
            'transTypeDesc': '分割',
            'enrollDate': '1010901',
            'unit1': '1.1234',
            'unit2': '1.1234',
            'divideFactor': '1.1234'
          },
          {
            'enrollDate': '1080902',
            'redeemType': '部分',
            'transType': '20',
            'transTypeDesc': '轉換',
            'outFundCode': 'CA000053475',
            'outFundName': '富蘭克林坦伯頓成長基金',
            'inFundCode': 'CA000053476',
            'inFundName': '寶來全球新興市場精選組合基金',
            'netValue': '1000.00',
            'unit1': '1.0000',
            'inNetValue': '20.0000',
            'unit2': '48.3537',
            'purchAmnt': '1000.00',
            'serviceFee1': '4.24',
            'shortLineAmt': '350.00'
          },
          {
            'enrollDate': '1080905',
            'redeemType': '部分',
            'transType': '30',
            'transTypeDesc': '贖回',
            'netValue': '1000.00',
            'purchRate': '350.00',
            'unit1': '1000.00',
            'purchAmnt': '1000.00',
            'serviceFee1': '350.00',
            'shortLineAmt': '350.00',
            'deferredAmt': '200.00',
            'serviceFee2': '780.00',
            'purchTotalAmnt': '1100.00',
            'redeemAcnt': '3352016523548535'
          },
          {
            'enrollDate': '1080907',
            'distrDate': '1080909',
            'transType': '40',
            'transTypeDesc': '除息',
            'unit1': '1000.00',
            'distrAmount': '1100.00',
            'purchAmnt': '990.00',
            'purchRate': '250.00',
            'serviceFee2': '130.00',
            'purchTotalAmnt': '1400.00',
            'redeemAcnt': '2265458569533265'
          },
          {
            'enrollDate': '1080912',
            'distrDate': '1080915',
            'transType': '50',
            'transTypeDesc': '除權',
            'unit1': '1000.00',
            'distrAmount': '1100.00',
            'serviceFee2': '750.00',
            'serviceFee1': '780.00',
            'beforeUnit': '1150.00',
            'afterUnit': '1200.00'
          },
          {
            'enrollDate': '1080918',
            'transType': '60',
            'transTypeDesc': '合併',
            'outFundCode': 'CA000053475',
            'outFundName': '富蘭克林坦伯頓成長基金',
            'inFundCode': 'CA000053476',
            'inFundName': '寶來全球新興市場精選組合基金',
            'mergerRate': '680.00',
            'netValue': '950.00',
            'purchRate': '1.0000',
            'unit1': '200.00',
            'inNetValue': '560.00',
            'unit2': '1000.00',
            'purchAmnt': '1500.00',
            'purchTotalAmnt': '1850.00'
          },
          {
            'enrollDate': '1080920',
            'transType': '70',
            'transTypeDesc': '分割',
            'unit1': '320.00',
            'unit2': '560.00',
            'divideFactor': '395.00'
          }
        ]
      },
      'paginatedInfo': {
        'totalRowCount': '7',
        'pageSize': '5',
        'pageNumber': '1',
        'sortColName': '',
        'sortDirection': 'DESC'
      }
    }
  }
};

