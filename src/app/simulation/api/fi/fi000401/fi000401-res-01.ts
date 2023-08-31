//[模擬]基金信託帳號查詢(單筆)
export const fi000401_res_01 = {
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
            'rtType': '3',
            'rtTypeDesc': '積極型(RR1~RR5)',
            'newAgrCD': 'N',
            'branchName': '羅東分行',
            'unitCall': '03-9545191',
            'stopFundWording': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'nextWorkDay': '1081126',
            'twAcntSize': '8',
            'frgnAcntSize': '0',
            'twOutAcnts': {
                'twOutAcnt': [
                    {
                        'twAcntNo': '9995705900056'
                    },
                    {
                        'twAcntNo': '9995872022613'
                    },
                    {
                        'twAcntNo': '9997227111116'
                    },
                    {
                        'twAcntNo': '9997765548796'
                    },
                    {
                        'twAcntNo': '9997765721722'
                    },
                ]
            },
            'frgnOutAcnts': {
                'frgnOutAcnt': [
                    {
                        'frgnAcntNo': '9997188012407',
                        'curr': 'USD,HKD,GBP'
                    },
                    {
                        'frgnAcntNo': '9997188012407',
                        'curr': 'USD'
                    },
                    {
                        'frgnAcntNo': '9997188012407',
                        'curr': 'USD,HKD'
                    }
                ]
            },
            'trustAcnts': {
                'trustAcnt': [
                    {
                        'trustAcntNo': '0580335265866',
                        'branchName': '羅東分行',
                        'sales': 'G221002969-游O雪,G120063386-李O鳴',
                        'intro': 'G120837411-李O典,G121468867-呂O歆,G101589445-蕭O昌,G221435842-張O圻,G220515332-林O惠,G100568817-林O欽,R221699942-湯O斐,G221002969-游O雪,G101096703-吳O銘,G221431719-林O均,G221053402-張O芳,G220789887-黃O猜'
                    },
                ]
            }
        }
    }
};


//[模擬]基金信託帳號查詢(小額)
export const fi000401_res_02 = {
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
            'rtType': '3',
            'rtTypeDesc': '積極型(RR1~RR4)',
            'newAgrCD': 'N',
            'branchName': '羅東分行',
            'unitCall': '03-9545191',
            'stopFundWording': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'nextWorkDay': '1081126',
            'twAcntSize': '8',
            'frgnAcntSize': '0',
            'twOutAcnts': {
                'twOutAcnt': [
                    {
                        'twAcntNo': '9995705900056'
                    },
                    {
                        'twAcntNo': '9995872022613'
                    },
                    {
                        'twAcntNo': '9997227111116'
                    },
                    {
                        'twAcntNo': '9997765548796'
                    },
                    {
                        'twAcntNo': '9997765721722'
                    },
                ]
            },
            'frgnOutAcnts': {
                'frgnOutAcnt': [
                    // {
                    //     'frgnAcntNo': '9997188012407',
                    //     'curr': 'USD,HKD,GBP'
                    // },
                    // {
                    //     'frgnAcntNo': '9997188012407',
                    //     'curr': 'USD'
                    // },
                    // {
                    //     'frgnAcntNo': '9997188012407',
                    //     'curr': 'USD,HKD'
                    // }
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
                        'pkgCode': 'N1',
                        'pkgName': 'TEST1'
                    },
                    {
                        'pkgCode': 'W0',
                        'pkgName': 'TEST3'
                    },
                    {
                        'pkgCode': 'W1',
                        'pkgName': 'TEST1'
                    }
                ]
            }
        }
    }
};


//[模擬]基金信託帳號查詢(預約單筆)
export const fi000401_res_03 = {
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
            'rtType': '3',
            'rtTypeDesc': '積極型(RR1~RR5)',
            'newAgrCD': 'N',
            'branchName': '羅東分行',
            'unitCall': '03-9545191',
            'stopFundWording': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'nextWorkDay': '1081126',
            'twAcntSize': '8',
            'frgnAcntSize': '0',
            'twOutAcnts': {
                'twOutAcnt': [
                    {
                        'twAcntNo': '9995705900011'
                    },
                    {
                        'twAcntNo': '9995872022616'
                    },
                    {
                        'twAcntNo': '9997227111122'
                    },
                    {
                        'twAcntNo': '9997765548799'
                    },
                    {
                        'twAcntNo': '9997765721781'
                    },
                    {
                        'twAcntNo': '9995705900056'
                    },
                ]
            },
            'frgnOutAcnts': {
                'frgnOutAcnt': [
                    null
                ]
            },
            'trustAcnts': {
                'trustAcnt': [
                    {
                        'trustAcntNo': '0580*********',
                        'branchName': '羅東分行',
                        'sales': 'G221002969-陳O瑞,G120063386-林O勳',
                        'intro': 'G120837411-李O欣,G121468867-呂O平,G101589445-蕭O藤,G221435842-張O圻,G220515332-林O惠,G100568817-林O欽,R221699942-湯O斐,G221002969-游O雪,G101096703-吳O銘,G221431719-林O均,G221053402-張O芳,G220789887-黃O猜,G220551749-林O瑜,G221336282-蔡O茜,G120063386-李O鳴,G120195356-黃O俊,G121519663-李O儒,G221337547-陳O樺,G221395889-楊O珊,G121387652-謝O勳,G101109938-林O銘,G120570608-林O陽,G220790415-陳O徵'
                    },
                ]
            }
        }
    }
};

// export const fi000401_res_04 = {
//     'MNBResponse': {
//       '@xmlns': 'http://mnb.hitrust.com/service/schema',
//       '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
//       'resHeader': {
//          'requestNo': '4b492598281d534755371d80-f1000101',
//          'requestTime': '2019-03-22T10:12:22.571+08:00',
//          'responseTime': '2019-03-22T10:12:26.721+08:00',
//          'custId': 'B121194483'
//       },
//       'failure': {
//        'debugMessage': '伺服器憑證錯誤',
//        'certCheck': 'Error',
//       }
//    }
// };

//[模擬]基金信託換約申請
export const fi000401_res_04 = {
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
            'newAgrCD': 'N',
            // 'stopFundWording': '基金主機暫停服務',
            // 'stopFundWording': '',

        }
    }
};


//[模擬]基金信託帳號查詢(預約單筆-新)
export const fi000401_res_05 = {
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
            'rtType': '3',
            'rtTypeDesc': '穩健型(RR1~RR4)',
            'branchName': '羅東分行',
            'unitCall': '02-25070111',
            'nextWorkDay': '1081126',
            'twAcntSize': '16',
            'frgnAcntSize': '0',
            'twOutAcnts': {
                'twOutAcnt': [
                    {
                        'twAcntNo': '0560765000110'
                    },
                    {
                        'twAcntNo': '0560766500698'
                    },
                    {
                        'twAcntNo': '0560766500701'
                    },
                    {
                        'twAcntNo': '9995705900056'
                    },
                    {
                        'twAcntNo': '0560766500710'
                    },
                    {
                        'twAcntNo': '0560766500868'
                    },
                    {
                        'twAcntNo': '0560766500931'
                    },
                    {
                        'twAcntNo': '0560766500957'
                    },
                    {
                        'twAcntNo': '0560766500990'
                    },
                ]
            },
            'frgnOutAcnts': {
                'frgnOutAcnt': [
                    {
                        'frgnAcntNo': '9997188012407',
                        'curr': 'USD,HKD,GBP'
                    },
                    {
                        'frgnAcntNo': '9997188012407',
                        'curr': 'USD'
                    },
                    {
                        'frgnAcntNo': '9997188012407',
                        'curr': 'USD,HKD'
                    }
                ]
            },
            'trustAcnts': {
                'trustAcnt': [
                    {
                        'trustAcntNo': '0560*********',
                        'branchName': '營業部',
                        'sales': 'G221002969-陳O瑞,G120063386-林O勳',
                        'intro': 'G120837411-李O欣,G121468867-呂O平,G101589445-蕭O藤,G221435842-張O圻,G220515332-林O惠,G100568817-林O欽,R221699942-湯O斐,G221002969-游O雪,G101096703-吳O銘,G221431719-林O均,G221053402-張O芳,G220789887-黃O猜,G220551749-林O瑜,G221336282-蔡O茜,G120063386-李O鳴,G120195356-黃O俊,G121519663-李O儒,G221337547-陳O樺,G221395889-楊O珊,G121387652-謝O勳,G101109938-林O銘,G120570608-林O陽,G220790415-陳O徵'
                    }
                ]
            }
        }
    }
};


//
export const fi000401_res_06 = 
    {"MNBResponse" : {"@xmlns" : "http://mnb.hitrust.com/service/schema","resHeader" : {"requestNo" : "fc891edad2a44c4a71b74f25-fi000401","requestTime" : "2019-08-12T19:42:06.982+08:00","responseTime" : "2019-08-12T19:42:10.258+08:00","custId" : "B121194483"},"failure" : {"debugMessage" : "(ERR1C104)現在已超過本日交易時間，或非營業日，如您欲以預約方式申購請點選「繼續」！","codeFromService" : "ERR1C104"}}}
    

