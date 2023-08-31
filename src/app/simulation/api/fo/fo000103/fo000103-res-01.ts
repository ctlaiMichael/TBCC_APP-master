export const fo000103_res_01 = {
  'MNBResponse': {
    '@xmlns': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
       'requestNo': '2010_12_15_10_32_21_171_12345',
       'requestTime': '2010-12-15T10:32:21.187+08:00',
       'responseTime': '2010-12-15T10:32:21.218+08:00',
       'custId': 'B1202812720'
    },
    'result': {
      '@xmlns:fo0': 'http://mnb.hitrust.com/service/schema/fo000103',
      '@xsi:type': 'fo0:fo000103ResultType',
      'fo0:rtnCode': '0000',
      'fo0:rtnMsg': '',
      'fo0:numLimit': '5',
      'fo0:saleList': {
        'fo0:sale': [
          {
            'fo0:saleId': '01',
            'fo0:saleName': '一般收付',
            'fo0:nowNumber': '0265',
            'fo0:waitperson': '4',
          },
          {
            'fo0:saleId': '02',
            'fo0:saleName': '外匯業務',
            'fo0:nowNumber': '0765',
            'fo0:waitperson': '0',
          },
          {
            'fo0:saleId': '03',
            'fo0:saleName': '定期存款',
            'fo0:nowNumber': '0165',
            'fo0:waitperson': '2',
          },
          {
            'fo0:saleId': '04',
            'fo0:saleName': '服務台',
            'fo0:nowNumber': '0602',
            'fo0:waitperson': '1',
          }
        ]
      }
    }
  }
};
