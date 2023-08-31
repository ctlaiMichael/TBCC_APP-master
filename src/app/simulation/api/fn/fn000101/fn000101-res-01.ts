export const fn000101_res_01 = {
  // === ATM綁定 或 取消綁定 === //
  'MNBResponse': {
    '@xmlns': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
       'requestNo': '2010_12_15_10_32_21_171_12345',
       'requestTime': '2010-12-15T10:32:21.187+08:00',
       'responseTime': '2010-12-15T10:32:21.218+08:00',
      //  'custId': 'B121194483'
       'custId': 'B1202812720'
    },
    // 'result': {
    //   '@xmlns:fn0': 'http://mnb.hitrust.com/service/schema/fn000102',
    //    '@xsi:type': 'fn0:fn000102ResultType',
    //    'fn0:custId': 'B1202812720',
    //    'fn0:recType': '2',
    //    'fn0:mailType': '1',
    //    'fn0:details': {
    //     'fn0:detail':
    //     [
    //       // === 綁定成功 === //
    //       // {
    //       //   'fn0:trnsAccnt': '0016200301199',
    //       //   'fn0:hostCode': '4001',
    //       //   'fn0:hostCodeMsg': '綁定成功',
    //       //   'fn0:pwdErrFlag': '',
    //       //   'fn0:pwdErrCnt': ''
    //       // },
    //       // {
    //       //   'fn0:trnsAccnt': '0016200301199',
    //       //   'fn0:hostCode': '4001',
    //       //   'fn0:hostCodeMsg': '綁定成功'
    //       // },
    //       // === 取消成功 === //
    //       // {
    //       //   'fn0:trnsAccnt': '0016200301199',
    //       //   'fn0:hostCode': '4001',
    //       //   'fn0:hostCodeMsg': '取消成功'
    //       // },
    //       // {
    //       //   'fn0:trnsAccnt': '0016200301199',
    //       //   'fn0:hostCode': '4001',
    //       //   'fn0:hostCodeMsg': '取消成功'
    //       // },
    //       // === 錯誤回傳 === //
    //       {
    //         'fn0:trnsAccnt': '9996765310271',
    //         'fn0:hostCode': '333B',
    //         'fn0:hostCodeMsg': '(333B)',
    //         'fn0:pwdErrFlag': '',
    //         'fn0:pwdErrCnt': ''
    //       }
    //     ]
    //    },
    // },
    // ==== 錯誤回傳訊息 ==== //
    'failure': {
      'debugMessage': '(112A)查無資料!!',
      'codeFromHost': '112A'
    }
  }
};
