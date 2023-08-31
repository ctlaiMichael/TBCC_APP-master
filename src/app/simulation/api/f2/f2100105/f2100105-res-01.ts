/**
 * [模擬]台幣粽存明細查詢
 */
export const f2100105_res_01 = {
    "MNBResponse": {
        "@xmlns:sch": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "2010_12_22_13_38_06_937_12345",
            "requestTime": "2010-12-22T13:38:06.984+08:00",
            "responseTime": "2010-12-22T13:38:07.046+08:00",
            "custId": "B120281270"
        },
        "result": {
            "@xmlns:f21": "http://mnb.hitrust.com/service/schema/f2100105",
            "@xsi:type": "f21:f2100105ResultType",

            "f21:details": {
                "f21:detail": [
                    {
                        "f21:transDate": "20101208",
                        "f21:digest": "摘要",
                        "f21:withdraw": "200",
                        "f21:deposit": "200",
                        "f21:balance1": "0",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "台中分行",
                        "f21:checkNumber": "1010101",
                        "f21:remarks": "remarks",
                        "f21:transTime": "235959",
                    },
                    {
                        "f21:transDate": "20101108",
                        "f21:digest": "中心轉存",
                        "f21:withdraw": "100",
                        "f21:deposit": "400",
                        "f21:balance1": "300",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "港乾分行",
                        "f21:checkNumber": "1010101",
                        "f21:remarks": "remarks",
                        "f21:transTime": "225959",
                    },
                    {
                        "f21:transDate": "20101008",
                        "f21:digest": "網路購物",
                        "f21:withdraw": "100",
                        "f21:deposit": "200",
                        "f21:balance1": "300",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "大安分行",
                        "f21:checkNumber": "1010101",
                        "f21:remarks": "remarks",
                        "f21:transTime": "235959",
                    },
                    {
                        "f21:transDate": "20101005",
                        "f21:digest": "中心轉入",
                        "f21:withdraw": "100",
                        "f21:deposit": "200",
                        "f21:balance1": "300",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "bankname",
                        "f21:checkNumber": "1010101",
                        "f21:remarks": "remarks",
                        "f21:transTime": "235959",
                    },
                    {
                        "f21:transDate": "20101001",
                        "f21:digest": "degs",
                        "f21:withdraw": "100",
                        "f21:deposit": "200",
                        "f21:balance1": "300",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "bankname",
                        "f21:checkNumber": "1010101",
                        "f21:remarks": "remarks",
                        "f21:transTime": "235959",
                    },
                    {
                        "f21:transDate": "20101208",
                        "f21:digest": "degs",
                        "f21:withdraw": "100",
                        "f21:deposit": "200",
                        "f21:balance1": "300",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "bankname",
                        "f21:checkNumber": "1010101",
                        "f21:remarks": "remarks",
                        "f21:transTime": "235959",
                    },
                    {
                        "f21:transDate": "20101208",
                        "f21:digest": "degs",
                        "f21:withdraw": "100",
                        "f21:deposit": "200",
                        "f21:balance1": "300",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "bankname",
                        "f21:checkNumber": "1010101",
                        "f21:remarks": "remarks",
                        "f21:transTime": "235959",
                    }

                ]
            },

            "paginatedInfo": {
                "totalRowCount": "7"
                , "pageSize": "3"
                , "pageNumber": "1"
                , "sortColName": ""
                , "sortDirection": "ASC"
            }
        }
    }
};
