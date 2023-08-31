export const fo000104_res_01 = {
  'MNBResponse': {
    '@xmlns': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
      'requestNo': '2010_12_15_10_32_21_171_12345',
      'requestTime': '2010-12-15T10:32:21.187+08:00',
      'responseTime': '2010-12-15T10:32:21.218+08:00',
      'custId': 'B1202812720'
    },
    'result': {
      '@xmlns:fo0': 'http://mnb.hitrust.com/service/schema/fo000104',
      '@xsi:type': 'fo0:fo000104ResultType',
      'fo0:rtnCode': '0000',
      'fo0:rtnMsg': null,
      'fo0:numLimit': '5',
      'fo0:branches': {
        'fo0:branch': [
          {
            'fo0:branchId': '0560',
            'fo0:branchName': '營業部',
            'fo0:branchAddr': '台北市館前路77號',
            'fo0:telephone': '02-23118811',
            'fo0:lon': '121.5151',
            'fo0:lat': '25.0437',
            'fo0:numRecords': {
              'fo0:record': {
                'fo0:saleId': '01',
                'fo0:saleName': '一般收付',
                'fo0:callNo': '0012',
                'fo0:nowNumber': '0071',
                'fo0:waitperson': '1',
                'fo0:overNo': 'Y'
              }
            }
          },
          {
            'fo0:branchId': '1106',
            'fo0:branchName': '北寧分行',
            'fo0:branchAddr': '台北市南京東路四段16號',
            'fo0:telephone': '02-25798811',
            'fo0:lon': '121.5529',
            'fo0:lat': '25.0512',
            'fo0:numRecords': {
              'fo0:record': [
                {
                  'fo0:saleId': '01',
                  'fo0:saleName': '一般收付',
                  'fo0:callNo': '0020',
                  'fo0:nowNumber': '0050',
                  'fo0:waitperson': '0',
                  'fo0:overNo': 'Y'
                },
                {
                  'fo0:saleId': '01',
                  'fo0:saleName': '一般收付',
                  'fo0:callNo': '0021',
                  'fo0:nowNumber': '0050',
                  'fo0:waitperson': '0',
                  'fo0:overNo': 'Y'
                }
              ]
            }
          }
        ]
      }
    }
  }
};
