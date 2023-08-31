export const fn000102_res_01 = {
  'MNBResponse': {
    '@xmlns': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
       'requestNo': '2010_12_15_10_32_21_171_12345',
       'requestTime': '2010-12-15T10:32:21.187+08:00',
       'responseTime': '2010-12-15T10:32:21.218+08:00',
      //  'custId': 'B121194483'
       'custId': 'B1202812720'
    },
    'result': {
      '@xmlns:fn0': 'http://mnb.hitrust.com/service/schema/fn000102',
       '@xsi:type': 'fn0:fn000102ResultType',
       'fn0:custId': 'B1202812720',
       'fn0:applyStatus': '1',
       'fn0:deviceId': '8CB269BF-F128-474B-BD45-EA915E2C67A9',
       'fn0:trnsToken': 'eb49b4637c48473bb1b298b67402c9dd',
       'fn0:nocrwdTime': '15',
       'fn0:details': {
        'fn0:detail':
        [
          {
            'fn0:account': '0016200301199',
            'fn0:usefulBalance': '123456789',
            'fn0:chrnatl': '0',
            'fn0:chrpur': ''
          },
          {
            'fn0:account': '1116200301199',
            'fn0:usefulBalance': '123456789',
            'fn0:chrnatl': '0',
            'fn0:chrpur': ''
          },
          // {
          //   'fn0:account': '2216200301199',
          //   'fn0:usefulBalance': '123456789',
          //   'fn0:chrnatl': '0',
          //   'fn0:chrpur': ''
          // },
          // {
          //   'fn0:account': '3316200301199',
          //   'fn0:usefulBalance': '123456789',
          //   'fn0:chrnatl': '0',
          //   'fn0:chrpur': ''
          // },
          // === 待ATM綁定 === //
          {
            'fn0:account': '2001010047278',
            'fn0:usefulBalance': '1234567891123',
            'fn0:chrnatl': '0',
            'fn0:chrpur': '1'
          },
          {
            'fn0:account': '2001010047255',
            'fn0:usefulBalance': '1234567891123',
            'fn0:chrnatl': '0',
            'fn0:chrpur': '1'
          },
          // {
          //   'fn0:account': '2001010047266',
          //   'fn0:usefulBalance': '1234567891123',
          //   'fn0:chrnatl': '0',
          //   'fn0:chrpur': '1'
          // },
          // {
          //   'fn0:account': '2001010047277',
          //   'fn0:usefulBalance': '1234567891123',
          //   'fn0:chrnatl': '0',
          //   'fn0:chrpur': '1'
          // },
          // {
          //   'fn0:account': '2001010047288',
          //   'fn0:usefulBalance': '1234567891123',
          //   'fn0:chrnatl': '0',
          //   'fn0:chrpur': '1'
          // }
          // ,
          // === 已綁定帳號 === //
          {
            'fn0:account': '0010010099889',
            'fn0:usefulBalance': '123456789',
            'fn0:chrnatl': '0',
            'fn0:chrpur': '2'
          },
          {
            'fn0:account': '1110010099889',
            'fn0:usefulBalance': '123456789',
            'fn0:chrnatl': '3',
            'fn0:chrpur': ''
          },
          {
            'fn0:account': '2210010099889',
            'fn0:usefulBalance': '123456789',
            'fn0:chrnatl': '0',
            'fn0:chrpur': '2'
          },
          // {
          //   'fn0:account': '0010010055555',
          //   'fn0:usefulBalance': '12345678',
          //   'fn0:chrnatl': '2',
          //   'fn0:chrpur': '2'
          // },
          // {
          //   'fn0:account': '0010010099999',
          //   'fn0:usefulBalance': '123456',
          //   'fn0:chrnatl': '1',
          //   'fn0:chrpur': '2'
          // },
          // {
          //   'fn0:account': '0010010088888',
          //   'fn0:usefulBalance': '1234567',
          //   'fn0:chrnatl': '9',
          //   'fn0:chrpur': '2'
          // }
        ]
       },
    },
    // ==== 錯誤回傳訊息 ==== //
    // 'failure': {
    //   'debugMessage': '(112A)查無資料!!',
    //   'codeFromHost': '112A'
    // }
  }
};
