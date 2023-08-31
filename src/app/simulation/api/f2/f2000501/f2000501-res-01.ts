export const f2000501_res_01 = {
    "MNBResponse": {
        "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "8cdc3aa0be8404e075070cb7-f1000103",
            "requestTime": "2010-12-22T13:32:21.578+08:00",
            "responseTime": "2010-12-22T13:32:21.750+08:00",
            "custId": "B120281272"
        },
        "result": {
            "@xmlns:f20": "http://mnb.hitrust.com/service/schema/f2000501",
            "@xsi:type": "f20:f2000501ResultType",
            "f20:result": "0",
            "f20:respCode": "4001",
            "f20:respCodeMsg": "查詢成功",
            "f20:twnBalance": "1000",
            "f20:fxnBalance": "10.00",
            "f20:fundBalance": null,
            "f20:goldBalance": undefined,
            "f20:totalAmt": "1010"
        }
    }
};

// export const f2000501_res_real = {
//     "MNBResponse": {
//         "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
//         "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
//         "resHeader": {
//             "requestNo": "8cdc3aa0be8404e075070cb7-f1000103",
//             "requestTime": "2010-12-22T13:32:21.578+08:00",
//             "responseTime": "2010-12-22T13:32:21.750+08:00",
//             "custId": "B120281272"
//         },
//         "result": {
//             "@xmlns:f20": "http://mnb.hitrust.com/service/schema/f2000501",
//             "@xsi:type": "f20:f2000501ResultType",
//             "f20:result": "0",
//             "f20:respCode": "4001",
//             "f20:respCodeMsg": "查詢成功",
//             "f20:twnBalance":  "60000000",
//             "f20:fxnBalance":  "13000000",
//             "f20:fundBalance": "10050000",
//             "f20:goldBalance": "20001999",
//             "f20:totalAmt": "103051999"
//         }
//     }
// };

export const f2000501_res_real = {
    "MNBResponse": {
        "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "8cdc3aa0be8404e075070cb7-f1000103",
            "requestTime": "2010-12-22T13:32:21.578+08:00",
            "responseTime": "2010-12-22T13:32:21.750+08:00",
            "custId": "B120281272"
        },
        "result": {
            "@xmlns:f20": "http://mnb.hitrust.com/service/schema/f2000501",
            "@xsi:type": "f20:f2000501ResultType",

            "f20:result": "0",
            "f20:respCode": "4001",
            "f20:respCodeMsg": "查詢成功",
            "f20:twnBalance": "100000000",
            "f20:fxnBalance": "3000000",
            "f20:fundBalance": "50000",
            "f20:goldBalance": "1999",
            "f20:totalAmt": "103051999"

            // "f20:result": "0",
            // "f20:respCode": "4001",
            // "f20:respCodeMsg": "查詢成功",
            // "f20:twnBalance": "771956",
            // "f20:fxnBalance": "11340",
            // "f20:fundBalance": "5000",
            // "f20:goldBalance": "22875",
            // "f20:totalAmt": "811171"
        }
    }
};

export const f2000501_res_error = {
    "MNBResponse": {
        "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "8cdc3aa0be8404e075070cb7-f1000103",
            "requestTime": "2010-12-22T13:32:21.578+08:00",
            "responseTime": "2010-12-22T13:32:21.750+08:00",
            "custId": "B120281272"
        },
        "result": {
            "@xmlns:f20": "http://mnb.hitrust.com/service/schema/f2000501",
            "@xsi:type": "f20:f2000501ResultType",
            // "f20:result": "1",
            // "f20:respCode": "0630",
            // "f20:respCodeMsg": "查詢資料失敗",
            // "f20:twnBalance": "",
            // "f20:fxnBalance": "",
            // "f20:fundBalance": "",
            // "f20:goldBalance": "",
            // "f20:totalAmt": ""

            "f20:result": "0",
            "f20:respCode": "3999",
            "f20:respCodeMsg": "交易量過大，暫時停止資料查詢",
            "f20:twnBalance": "",
            "f20:fxnBalance": "",
            "f20:fundBalance": "",
            "f20:goldBalance": "",
            "f20:totalAmt": ""
        }
    }
};