// export const fi000601_res_01 = {
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

export const fi000601_res_01 = {
  'MNBResponse': {
    '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
      'requestNo': '8cdc3aa0be8404e075070cb7-f1000103',
      'requestTime': '2019-03-25T18:37:44.777+08:00',
      'responseTime': '2019-03-25T18:37:44.777+08:00',
      'custId': null
    },

    'result': {
      '@xsi:type': 'fi0:fi000601ResultType',
      '@xmlns:fi0': 'http://mnb.hitrust.com/service/schema/fi000601',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

      'custId': 'F121***529',
      'trnsDateTime': '20190423150000',
      'trnsToken': 'UISS7897987201904231500000000000',
      'details': {
        'detail': [
          {
            'enrollDate': '1080424',
            'effectDate': '1080424',
            'reserveTransCode': '20190424150000',
            'transType': '20',
            'transTypeDesc': '轉換',
            'fundCode': 'YA000340734NB',
            'fundName': '高收益債券月配南非幣C',
            'fundRisk': 'RR1',
            'transCode': '20190424150000',
            'currency': 'ZAR',
            'inCurrency': 'ZAR',
            'purchAmnt': '0.00',
            'serviceFee': '0.00',
            'payAccount': '1000201265479',
            'redeemAccount': '0560766500710',
            'lastChangeDate': '1080423',
            'status': 'D',
            'statusDesc': '已取消',
            'inFundCode': '0407',
            'inFundName': '安聯香港基金'
          },
          {
            'enrollDate': '1080423',
            'effectDate': '1080423',
            'reserveTransCode': '20190423150000',
            'transType': '10',
            'transTypeDesc': '單筆申購',
            'fundCode': 'YA000340734NB',
            'fundName': '高收益債券月配南非幣C',
            'fundRisk': 'RR1',
            'transCode': '20190423150000',
            'currency': 'ZAR',
            'inCurrency': 'ZAR',
            'purchAmnt': '0.00',
            'serviceFee': '0.00',
            'payAccount': '1000201265479',
            'redeemAccount': '0560766500710',
            'lastChangeDate': '1080423',
            'status': 'C',
            'statusDesc': '待處理',
            'inFundCode': '0407',
            'inFundName': '安聯香港基金'
          },
          {
            'enrollDate': '1080422',
            'effectDate': '1080422',
            'reserveTransCode': '20190422150000',
            'transType': '20',
            'transTypeDesc': '轉換',
            'fundCode': 'YA000340734ND',
            'fundName': '高收益債券月配南非幣D',
            'fundRisk': 'RR2',
            'transCode': '20190422150000',
            'currency': 'ZAR',
            'inCurrency': 'ZAR',
            'purchAmnt': '0.00',
            'serviceFee': '0.00',
            'payAccount': '1000201265479',
            'redeemAccount': '0560766500710',
            'lastChangeDate': '1080422',
            'status': 'D',
            'statusDesc': '已取消',
            'inFundCode': '0407',
            'inFundName': '安聯香港基金'
          },
          {
            'enrollDate': '1080419',
            'effectDate': '1080419',
            'reserveTransCode': '20190419150000',
            'transType': '30',
            'transTypeDesc': '贖回',
            'fundCode': 'YA000340734ND',
            'fundName': '高收益債券月配南非幣D',
            'fundRisk': 'RR2',
            'transCode': '20190419150000',
            'currency': 'ZAR',
            'inCurrency': 'ZAR',
            'purchAmnt': '0.00',
            'serviceFee': '0.00',
            'payAccount': '1000201265479',
            'redeemAccount': '0560766500710',
            'lastChangeDate': '1080419',
            'status': 'E',
            'statusDesc': '已處理(成功)',
            'inFundCode': '0407',
            'inFundName': '安聯香港基金'
          },
          {
            'enrollDate': '1080418',
            'effectDate': '1080418',
            'reserveTransCode': '20190418150000',
            'transType': '10',
            'transTypeDesc': '單筆申購',
            'fundCode': 'YA000340734ND',
            'fundName': '高收益債券月配南非幣D',
            'fundRisk': 'RR2',
            'transCode': '20190418150000',
            'currency': 'ZAR',
            'inCurrency': 'ZAR',
            'purchAmnt': '0.00',
            'serviceFee': '0.00',
            'payAccount': '1000201265479',
            'redeemAccount': '0560766500710',
            'lastChangeDate': '1080418',
            'status': 'D',
            'statusDesc': '已取消',
            'inFundCode': '0407',
            'inFundName': '安聯香港基金'
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

