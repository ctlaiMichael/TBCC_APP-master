export const fo000101_res_01 = {
  'MNBResponse': {
    '@xmlns': 'http://mnb.hitrust.com/service/schema',
    'resHeader': {
       'requestNo': '2010_12_15_10_32_21_171_12345',
       'requestTime': '2010-12-15T10:32:21.187+08:00',
       'responseTime': '2010-12-15T10:32:21.218+08:00',
       'custId': 'B1202812720'
    },
    'result': {
      '@xmlns:fo0': 'http://mnb.hitrust.com/service/schema/fo000101',
      '@xsi:type': 'fo0:fo000101ResultType',
      'fo0:rtnCode': '0000',
      'fo0:rtnMsg': '',
      'fo0:isBusinessDate': 'Y',
      'fo0:counties': {
        'fo0:county': [
          {
            'fo0:countyCode': '01',
            'fo0:countyName': '臺北市',
            'fo0:regions': {
              'fo0:region': [
                {
                  'fo0:regionCode': '100',
                  'fo0:regionName': '中正區'
                },
                {
                  'fo0:regionCode': '103',
                  'fo0:regionName': '大同區'
                },
                {
                  'fo0:regionCode': '104',
                  'fo0:regionName': '中山區'
                },
                {
                  'fo0:regionCode': '105',
                  'fo0:regionName': '松山區'
                }
              ]
            }
          },
          {
            'fo0:countyCode': '02',
            'fo0:countyName': '新北市',
            'fo0:regions': {
              'fo0:region': [
                {
                  'fo0:regionCode': '207',
                  'fo0:regionName': '萬里區'
                },
                {
                  'fo0:regionCode': '208',
                  'fo0:regionName': '金山區'
                },
                {
                  'fo0:regionCode': '220',
                  'fo0:regionName': '板橋區'
                }
              ]
            }
          },
          {
            'fo0:countyCode': '20',
            'fo0:countyName': '台東縣',
            'fo0:regions': {
              'fo0:region': {
                'fo0:regionCode': '950',
                'fo0:regionName': '臺東市'
              }
            }
          },
          {
            'fo0:countyCode': '21',
            'fo0:countyName': '花蓮縣',
            'fo0:regions': {
              'fo0:region': {
                'fo0:regionCode': '970',
                'fo0:regionName': '花蓮市'
              }
            }
          }
        ]
      }
    }
  }
};
