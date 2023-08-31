// export const fi000501_res_01 = {
//   'MNBResponse': {
//     '@xmlns': 'http://mnb.hitrust.com/service/schema',
//     '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
//     'resHeader': {
//        'requestNo': '4b492598281d534755371d80-f1000101',
//        'requestTime': '2019-03-22T10:12:22.571+08:00',
//        'responseTime': '2019-03-22T10:12:26.721+08:00',
//        'custId': 'B121194483'
//     },
//     'failure': {
//      'debugMessage': '伺服器憑證錯誤',
//      'certCheck': 'Error',
//     }
//  }
// };

export const fi000501_res_error = {
    "MNBResponse": {
        "@xmlns": "http://mnb.hitrust.com/service/schema",
        "resHeader": {
            "requestNo": "fc891edad2a44c4a71b74f25-fi000501",
            "requestTime": "2019-08-12T19:42:06.982+08:00",
            "responseTime": "2019-08-12T19:42:10.258+08:00",
            "custId": "B121194483"
        },
        "failure": {
            "debugMessage": "type error",
            "codeFromService": "ERROR"
        }
    }
};
//基金庫存查詢
export const fi000501_res_01 =

// {"MNBResponse" : {"@xmlns" : "http://mnb.hitrust.com/service/schema","resHeader" : {"requestNo" : "0d44d7e953f53a2b6c5b95ef-fi000501","requestTime" : "2019-07-17T20:05:20.161+08:00","responseTime" : "2019-07-17T20:05:24.404+08:00","custId" : "B121194483"},"failure" : {"debugMessage" : "(ERR1C115)現在已超過本日交易時間，或非營業日","codeFromService" : "ERR1C115"}}}
{
    'MNBResponse': {
        '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
        'resHeader': {
            'requestNo': '8cdc3aa0be8404e075070cb7-fi000501',
            'requestTime': '2019-03-25T18:37:44.777+08:00',
            'responseTime': '2019-03-25T18:37:44.777+08:00',
            'custId': null
        },

        'result': {
            '@xsi:type': 'fi0:fi000501ResultType',
            '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fi000501',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

            'custId': 'B121194483',
            'details': {
                'detail': [
                    {
                        'fundCode': '0802',
                        'fundName': '富蘭克林坦伯頓成長基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'USD',
                        'invenAmount': '1000',
                        'transCode': 'CA000053475',
                        'trustAcnt': '0600888007480',
                        'unit': '12.35',
                        'account': '006088807400'
                    },
                    {
                        'fundCode': '6262',
                        'fundName': '寶來全球新興市場精選組合基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '5000',
                        'transCode': 'CA000053476',
                        'trustAcnt': '0600888007480',
                        'unit': '12.35',
                        'account': '006088807400',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '6263',
                        'fundName': '匯豐龍鳳基金Ａ類型',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '5600',
                        'transCode': 'CA000053485',
                        'trustAcnt': '0600888007570',
                        'unit': '13.35',
                        'account': '006088807500',
                        'code': 'A2'
                    },
                    {
                        'fundCode': '6264',
                        'fundName': '匯豐龍鳳基金B類型',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '6200',
                        'transCode': 'CA000053520',
                        'trustAcnt': '0600888007560',
                        'unit': '11.35',
                        'account': '006088807560',
                        'code': 'A2'
                    },
                    {
                        'fundCode': '6265',
                        'fundName': '寶來全球新興市場精選組合基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '5000',
                        'transCode': 'CA000053476',
                        'trustAcnt': '0600888007480',
                        'unit': '12.35',
                        'account': '006088807400',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '6266',
                        'fundName': '摩根富明林新興中東基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'USD',
                        'invenAmount': '6100',
                        'transCode': 'CA000053520',
                        'trustAcnt': '0600888007691',
                        'unit': '15.35',
                        'account': '006088807652'
                    },
                    {
                        'fundCode': '6267',
                        'fundName': '富蘭克林坦伯頓成長基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '5500',
                        'transCode': 'CA000053850',
                        'trustAcnt': '0600888007360',
                        'unit': '14.35',
                        'account': '006088807530',
                        'code': 'A3'
                    },
                    {
                        'fundCode': '6268',
                        'fundName': '摩根富明林新興中東基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'NTD',
                        'invenAmount': '6550',
                        'transCode': 'CA000053560',
                        'trustAcnt': '0600888008530',
                        'unit': '17.35',
                        'account': '006088807650',
                        'code': 'A1'
                    }
                ]
            },
            'paginatedInfo': {
                'totalRowCount': '8',
                'pageSize': '3',
                'pageNumber': '1',
                'sortColName': '',
                'sortDirection': 'ASC'
            }
        }
    }
};

//基金庫存查詢(預約)
export const fi000501_res_02 = {
    'MNBResponse': {
        '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
        'resHeader': {
            'requestNo': '8cdc3aa0be8404e075070cb7-fi000501',
            'requestTime': '2019-03-25T18:37:44.777+08:00',
            'responseTime': '2019-03-25T18:37:44.777+08:00',
            'custId': null
        },

        'result': {
            '@xsi:type': 'fi0:fi000501ResultType',
            '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fi000501',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

            'custId': 'B121194483',
            'details': {
                'detail': [
                    {
                        'fundCode': '5305',
                        'fundName': '匯豐台灣精典基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'TWD',
                        'invenAmount': '10000.00',
                        'transCode': 'CA001000328',
                        'trustAcnt': '0600888******',
                        'unit': '448.4000',
                        'account': '1058665940804',
                        'code': ''
                    },
                    {
                        'fundCode': '5713',
                        'fundName': '保德信大中華基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'TWD',
                        'invenAmount': '20000.00',
                        'transCode': 'CA001000348',
                        'trustAcnt': '0600888******',
                        'unit': '797.0000',
                        'account': '9997899333311',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '5401',
                        'fundName': '元大多福基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'TWD',
                        'invenAmount': '10000.00',
                        'transCode': 'CA001000358',
                        'trustAcnt': '0600888******',
                        'unit': '199.3000',
                        'account': '9997899333311',
                        'code': ''
                    },
                    {
                        'fundCode': '6264',
                        'fundName': '匯豐龍鳳基金B類型',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '20000',
                        'transCode': 'CA000053520',
                        'trustAcnt': '0600888007560',
                        'unit': '11.35',
                        'account': '006088807560',
                        'code': 'A2'
                    },
                    {
                        'fundCode': '6265',
                        'fundName': '寶來全球新興市場精選組合基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '5000',
                        'transCode': 'CA000053476',
                        'trustAcnt': '0600888007480',
                        'unit': '12.35',
                        'account': '006088807400',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '6266',
                        'fundName': '摩根富明林新興中東基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'USD',
                        'invenAmount': '6100',
                        'transCode': 'CA000053520',
                        'trustAcnt': '0600888007691',
                        'unit': '15.35',
                        'account': '006088807652'
                    },
                    {
                        'fundCode': '6267',
                        'fundName': '富蘭克林坦伯頓成長基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '20000',
                        'transCode': 'CA000053850',
                        'trustAcnt': '0600888007360',
                        'unit': '14.35',
                        'account': '006088807530',
                        'code': 'A3'
                    },
                    {
                        'fundCode': '6268',
                        'fundName': '摩根富明林新興中東基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'NTD',
                        'invenAmount': '6550',
                        'transCode': 'CA000053560',
                        'trustAcnt': '0600888008530',
                        'unit': '17.35',
                        'account': '006088807650',
                        'code': 'A1'
                    }
                ]
            },
            'paginatedInfo': {
                'totalRowCount': '8',
                'pageSize': '3',
                'pageNumber': '1',
                'sortColName': '',
                'sortDirection': 'ASC'
            }
        }
    }
};
//errorCode 116(預約)
export const fi000501_res_03 =
    { "MNBResponse": { "@xmlns": "http://mnb.hitrust.com/service/schema", "resHeader": { "requestNo": "fc891edad2a44c4a71b74f25-fi000501", "requestTime": "2019-08-12T19:42:06.982+08:00", "responseTime": "2019-08-12T19:42:10.258+08:00", "custId": "B121194483" }, "failure": { "debugMessage": "(ERR1C116)現在已超過本日交易時間，或非營業日，如您欲以預約方式贖回，請點選 繼續 !", "codeFromService": "ERR1C116" } } };
//errorCode 101(尚未申請基金下單)
export const fi000501_res_04 =
    { "MNBResponse": { "@xmlns": "http://mnb.hitrust.com/service/schema", "resHeader": { "requestNo": "fc891edad2a44c4a71b74f25-fi000501", "requestTime": "2019-08-12T19:42:06.982+08:00", "responseTime": "2019-08-12T19:42:10.258+08:00", "custId": "B121194483" }, "failure": { "debugMessage": "(ERR1C101)親愛的客戶您好，您尚未申請網路銀行基金下單，請至營業單位臨櫃辦理網路銀行基金下單功能", "codeFromService": "ERR1C101" } } };
export const fi000501_res_05 =
    { "MNBResponse": { "@xmlns": "http://mnb.hitrust.com/service/schema", "resHeader": { "requestNo": "fc891edad2a44c4a71b74f25-fi000501", "requestTime": "2019-08-12T19:42:06.982+08:00", "responseTime": "2019-08-12T19:42:10.258+08:00", "custId": "B121194483" }, "failure": { "debugMessage": "(ERR1C104)現在已超過本日交易時間，或非營業日，如您欲以預約方式贖回，請點選 繼續 !", "codeFromService": "ERR1C104" } } };

//基金庫存查詢(轉換，一轉一)
export const fi000501_res_06 = {
    'MNBResponse': {
        '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
        'resHeader': {
            'requestNo': '8cdc3aa0be8404e075070cb7-fi000501',
            'requestTime': '2019-03-25T18:37:44.777+08:00',
            'responseTime': '2019-03-25T18:37:44.777+08:00',
            'custId': null
        },

        'result': {
            '@xsi:type': 'fi0:fi000501ResultType',
            '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fi000501',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

            'custId': 'B121194483',
            'details': {
                'detail': [
                    {
                        'fundCode': '5505',
                        'fundName': '匯豐台灣精元基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'TWD',
                        'invenAmount': '20000.00',
                        'transCode': 'CA001000542',
                        'trustAcnt': '0600888******',
                        'unit': '448.4000',
                        'account': '1058885580950',
                        'code': ''
                    },
                    {
                        'fundCode': '5814',
                        'fundName': '保德信用中華基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'TWD',
                        'invenAmount': '30000.00',
                        'transCode': 'CA001000920',
                        'trustAcnt': '0600888******',
                        'unit': '797.0000',
                        'account': '9997520355522',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '5530',
                        'fundName': '元大多福基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'TWD',
                        'invenAmount': '15000.00',
                        'transCode': 'CA001000652',
                        'trustAcnt': '0600888******',
                        'unit': '199.3000',
                        'account': '9997898993445',
                        'code': ''
                    },
                    {
                        'fundCode': '6589',
                        'fundName': '匯豐龍鳳基金C類型',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '25000',
                        'transCode': 'CA000075260',
                        'trustAcnt': '0600888007560',
                        'unit': '11.35',
                        'account': '006088807560',
                        'code': 'A2'
                    },
                    {
                        'fundCode': '6265',
                        'fundName': '寶來全球新興市場精選組合基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '5000',
                        'transCode': 'CA000053476',
                        'trustAcnt': '0600888007480',
                        'unit': '12.35',
                        'account': '006088807400',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '6266',
                        'fundName': '摩根富明林新興中東基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'USD',
                        'invenAmount': '6100',
                        'transCode': 'CA000053520',
                        'trustAcnt': '0600888007691',
                        'unit': '15.35',
                        'account': '006088807652'
                    }
                ]
            },
            'paginatedInfo': {
                'totalRowCount': '8',
                'pageSize': '3',
                'pageNumber': '1',
                'sortColName': '',
                'sortDirection': 'ASC'
            }
        }
    }
};

//基金庫存查詢(轉換，一轉三)
export const fi000501_res_07 = {
    'MNBResponse': {
        '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
        'resHeader': {
            'requestNo': '8cdc3aa0be8404e075070cb7-fi000501',
            'requestTime': '2019-03-25T18:37:44.777+08:00',
            'responseTime': '2019-03-25T18:37:44.777+08:00',
            'custId': null
        },

        'result': {
            '@xsi:type': 'fi0:fi000501ResultType',
            '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fi000501',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

            'custId': 'B121194483',
            'details': {
                'detail': [
                    {
                        'fundCode': '6589',
                        'fundName': '匯豐龍鳳基金C類型',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '25000',
                        'transCode': 'CA000075260',
                        'trustAcnt': '0600888007560',
                        'unit': '11.35',
                        'account': '006088807560',
                        'code': 'A2'
                    },
                    {
                        'fundCode': '6265',
                        'fundName': '寶來全球新興市場精選組合基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '5000',
                        'transCode': 'CA000053476',
                        'trustAcnt': '0600888007480',
                        'unit': '12.35',
                        'account': '006088807400',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '6266',
                        'fundName': '摩根富明林新興中東基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'USD',
                        'invenAmount': '6100',
                        'transCode': 'CA000053520',
                        'trustAcnt': '0600888007691',
                        'unit': '15.35',
                        'account': '006088807652'
                    },
                    {
                        'fundCode': '6267',
                        'fundName': '富蘭克林坦伯頓成長基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '20000',
                        'transCode': 'CA000053850',
                        'trustAcnt': '0600888007360',
                        'unit': '14.35',
                        'account': '006088807530',
                        'code': 'A3'
                    },
                    {
                        'fundCode': '6268',
                        'fundName': '摩根富明林新興中東基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'NTD',
                        'invenAmount': '6550',
                        'transCode': 'CA000053560',
                        'trustAcnt': '0600888008530',
                        'unit': '17.35',
                        'account': '006088807650',
                        'code': 'A1'
                    }
                ]
            },
            'paginatedInfo': {
                'totalRowCount': '8',
                'pageSize': '3',
                'pageNumber': '1',
                'sortColName': '',
                'sortDirection': 'ASC'
            }
        }
    }
};

//基金庫存查詢(轉換，一轉一，預約)
export const fi000501_res_08 = {
    'MNBResponse': {
        '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
        'resHeader': {
            'requestNo': '8cdc3aa0be8404e075070cb7-fi000501',
            'requestTime': '2019-03-25T18:37:44.777+08:00',
            'responseTime': '2019-03-25T18:37:44.777+08:00',
            'custId': null
        },

        'result': {
            '@xsi:type': 'fi0:fi000501ResultType',
            '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fi000501',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

            'custId': 'B121194483',
            'details': {
                'detail': [
                    {
                        'fundCode': '5560',
                        'fundName': '元大台灣精元基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'TWD',
                        'invenAmount': '20000.00',
                        'transCode': 'CA001000542',
                        'trustAcnt': '0600888******',
                        'unit': '448.4000',
                        'account': '1058885580950',
                        'code': ''
                    },
                    {
                        'fundCode': '5814',
                        'fundName': '保德信用中華基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'TWD',
                        'invenAmount': '30000.00',
                        'transCode': 'CA001000920',
                        'trustAcnt': '0600888******',
                        'unit': '797.0000',
                        'account': '9997520355522',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '5530',
                        'fundName': '元大多福基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'TWD',
                        'invenAmount': '15000.00',
                        'transCode': 'CA001000652',
                        'trustAcnt': '0600888******',
                        'unit': '199.3000',
                        'account': '9997898993445',
                        'code': ''
                    },
                    {
                        'fundCode': '6589',
                        'fundName': '匯豐龍鳳基金C類型',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '25000',
                        'transCode': 'CA000075260',
                        'trustAcnt': '0600888007560',
                        'unit': '11.35',
                        'account': '006088807560',
                        'code': 'A2'
                    },
                    {
                        'fundCode': '6265',
                        'fundName': '寶來全球新興市場精選組合基金',
                        'investType': '2',
                        'investDesc': '小額',
                        'iNCurrency': 'NTD',
                        'invenAmount': '5000',
                        'transCode': 'CA000053476',
                        'trustAcnt': '0600888007480',
                        'unit': '12.35',
                        'account': '006088807400',
                        'code': 'A1'
                    },
                    {
                        'fundCode': '6266',
                        'fundName': '摩根富明林新興中東基金',
                        'investType': '1',
                        'investDesc': '單筆',
                        'iNCurrency': 'USD',
                        'invenAmount': '6100',
                        'transCode': 'CA000053520',
                        'trustAcnt': '0600888007691',
                        'unit': '15.35',
                        'account': '006088807652'
                    }
                ]
            },
            'paginatedInfo': {
                'totalRowCount': '8',
                'pageSize': '3',
                'pageNumber': '1',
                'sortColName': '',
                'sortDirection': 'ASC'
            }
        }
    }
};


    

    