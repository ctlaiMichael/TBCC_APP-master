export const fn000103_res_01 = {
  // === OTP綁定 === //
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
    //   '@xmlns:fn0': 'http://mnb.hitrust.com/service/schema/fn000103',
    //    '@xsi:type': 'fn0:fn000103ResultType',
    //    'fn0:custId': 'B1202812720',
    //    'fn0:mailType': '1',
    //    'fn0:details': {
    //     'fn0:detail':
    //     [
    //       {
    //         'fn0:trnsAccnt': '0016200301199',
    //         'fn0:hostCode': '4001',
    //         'fn0:hostCodeMsg': '綁定成功'
    //       },
    //       {
    //         'fn0:trnsAccnt': '0016200301199',
    //         'fn0:hostCode': '4001',
    //         'fn0:hostCodeMsg': '綁定成功'
    //       }
    //       ,
    //       {
    //         'fn0:trnsAccnt': '0016200301199',
    //         'fn0:hostCode': '4001',
    //         'fn0:hostCodeMsg': '綁定成功'
    //       }
    //     ]
    //    },
    // }
    // === failure === //
    'failure': {
      'debugMessage' : 'OTP驗證錯誤!!',
      'codeFromHost' : 'ERROTP_O0011'
    }
    // 'failure': {
    //   'debugMessage': '(112A)查無資料!!',
    //   'codeFromHost': '112A'
    // }
  }
};
