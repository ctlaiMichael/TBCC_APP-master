export const fn000104_res_02 = {
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
    //    'fn0:recType': 'D',
    //    'fn0:trnsAccnt': '0009998717858682',
    //    'fn0:transAmt': '00000000000',
    //    'fn0:trnsTxNo': '0718241997',
    //    'fn0:deadlineTime': '201905161530',
    //    'fn0:hostCode': '4001',
    //    'fn0:hostCodeMsg': '交易成功',
    //    'fn0:trnsRsltCode': '0',
    // }
    // === 取消預約交易失敗 === //
    'result': {
      '@xmlns:fn0': 'http://mnb.hitrust.com/service/schema/fn000104',
       '@xsi:type': 'fn0:fn000104ResultType',
       'fn0:custId': 'K220986263',
       'fn0:hostCode': '112C',
       'fn0:hostCodeMsg': '查無有效之預約資料',
       'fn0:trnsRsltCode': '1'
    }
  }
};
