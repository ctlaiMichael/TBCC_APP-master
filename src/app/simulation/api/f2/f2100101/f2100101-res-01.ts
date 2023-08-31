// 台幣活支存交易明細
export const f2100101_res_01 = {
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
            "@xmlns:f21": "http://mnb.hitrust.com/service/schema/f2100101",
            "@xsi:type": "f21:f2100101ResultType",

            "f21:details": {
                "f21:detail": [
                    {
                        "f21:transDate": "20181208",
                        "f21:digest": "利息",
                        "f21:withdraw": "",
                        "f21:deposit": "0",
                        "f21:balance1": "2986",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "合庫營",
                        "f21:checkNumber": "",
                        "f21:remarks": "$0(稅)",
                        "f21:transTime": "235959"
                    },
                    {
                        "f21:transDate": "20181207",
                        "f21:digest": "跨行存款",
                        "f21:withdraw": "",
                        "f21:deposit": "1985",
                        "f21:balance1": "2986",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "中國信託商業銀行",
                        "f21:checkNumber": "",
                        "f21:remarks": "51049999999996",
                        "f21:transTime": "235959"
                    },
                    {
                        "f21:transDate": "20181206",
                        "f21:digest": "提領",
                        "f21:withdraw": "1000",
                        "f21:deposit": "",
                        "f21:balance1": "1001",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "合庫西湖",
                        "f21:checkNumber": "",
                        "f21:remarks": "",
                        "f21:transTime": "235959"
                    },
                    {
                        "f21:transDate": "20181206",
                        "f21:digest": "無摺現存",
                        "f21:withdraw": "",
                        "f21:deposit": "1",
                        "f21:balance1": "2001",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "合庫西湖",
                        "f21:checkNumber": "",
                        "f21:remarks": "",
                        "f21:transTime": "235959"
                    },
                    {
                        "f21:transDate": "20181205",
                        "f21:digest": "",
                        "f21:withdraw": "",
                        "f21:deposit": "",
                        "f21:balance1": "1000",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "合庫西湖",
                        "f21:checkNumber": "",
                        "f21:remarks": "",
                        "f21:transTime": "235959"
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
