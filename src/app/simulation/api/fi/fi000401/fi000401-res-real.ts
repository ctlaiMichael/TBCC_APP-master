// [模擬]基金信託帳號查詢(小額)
const res_02 = {
    'MNBResponse': {
        '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
        'resHeader': {
            'requestNo': '8cdc3aa0be8404e075070cb7-fi000401',
            'requestTime': '2019-03-25T18:37:44.777+08:00',
            'responseTime': '2019-03-25T18:37:44.777+08:00',
            'custId': null
        },

        'result': {
            '@xsi:type': 'fh0:fi000401ResultType',
            '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fi000401',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'custId': 'B121194483',
            'rtType': 2,
            'rtTypeDesc': '穩健型(RR1~RR4)',
            'branchName': '羅東分行',
            'unitCall': '03-9545191',
            'twAcntSize': 2,
            'frgnAcntSize': 1,
            'twOutAcnts': {
                'twOutAcnt': [
                    {
                        'twAcntNo': '5104765000001'
                    },
                    {
                        'twAcntNo': '9995872022613'
                    }
                ]
            },
            'frgnOutAcnts': {
                'frgnOutAcnt': [
                    {
                        'frgnAcntNo': '5104765000002',
                        'curr': 'USD'
                    }
                ]
            },
            'trustAcnts': {
                'trustAcnt': [
                    {
                        'trustAcntNo': '0580*********',
                        'branchName': '羅東分行',
                        'sales': 'G221002969-游O雪,G120063386-李O鳴',
                        'intro': 'G120837411-李O典,G121468867-呂O歆,G101589445-蕭O昌,G221435842-張O圻,G220515332-林O惠,G100568817-林O欽,R221699942-湯O斐,G221002969-游O雪,G101096703-吳O銘,G221431719-林O均,G221053402-張O芳,G220789887-黃O猜,G220551749-林O瑜,G221336282-蔡O茜,G120063386-李O鳴,G120195356-黃O俊,G121519663-李O儒,G221337547-陳O樺,G221395889-楊O珊,G121387652-謝O勳,G101109938-林O銘,G120570608-林O陽,G220790415-陳O徵'
                    },
                ]
            },
            'pkgLists': {
                'pkgList': [
                    {
                        'pkgCode': 'A1',
                        'pkgName': '漲跌幅正負5%'
                    },
                    {
                        'pkgCode': 'A2',
                        'pkgName': '漲跌幅正負10%'
                    },
                    {
                        'pkgCode': 'A3',
                        'pkgName': '漲跌幅正負15%'
                    }
                ]
            }
        }
    }
};


// [模擬]real data test
export const fi000401_res_real = {
    'res_02': res_02
};

