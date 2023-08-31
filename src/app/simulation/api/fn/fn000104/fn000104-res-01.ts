export const fn000104_res_01 = {
  'MNBResponse': {
    '@xmlns': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
       'requestNo': '2010_12_15_16_32_51_140_12345',
       'requestTime': '2010-12-15T16:32:51.156+08:00',
       'responseTime': '2010-12-15T16:32:51.156+08:00',
      //  'custId': 'B121194483'
       'custId': 'B1202812720'
    },
    // 'result': {
    //   '@xmlns:fn0': 'http://mnb.hitrust.com/service/schema/fn000104',
    //    '@xsi:type': 'fn0:fn000104ResultType',
    //    'fn0:custId': 'B1202812720',
    //    'fn0:recType': 'A',
    //    'fn0:hostCode': '4001',
    //    'fn0:hostCodeMsg': '',
    //    'fn0:trnsRsltCode': '0',
    //    'fn0:trnsAccnt': '0016200301199',
    //    'fn0:transAmt': '3000',
    //    'fn0:trnsTxNo': '6355855000',
    //    'fn0:deadlineTime': '20190718173015',
    // },
    // ==== 錯誤回傳訊息 ==== //
    'failure': {
      'debugMessage': '(112A)查無資料!!',
      'codeFromHost': '112A'
    }
  }
};
