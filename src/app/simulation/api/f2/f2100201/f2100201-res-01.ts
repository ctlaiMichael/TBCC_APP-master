/**
 * [模擬] F2100201-外匯存款帳戶交易明細查詢(綜活存)
 *  realBal	實質餘額
 *  usefulBal	可用餘額
 *  saveBookBal	存摺餘額
 *  freezeBal	凍結總額
 *  distrainBal	扣押總額
 * [details]:
 *      transDate;//	交易日期
 *      digest;//	摘要
 *      withdraw;//	存款金額
 *      deposit;//	提款金額
 *      balance;//	結餘金額
 *      rcvBankId;//	交易行庫代碼
 *      rcvBankName;//	交易行庫名稱
 *      currency;//	幣別
 *      currName;//	幣別名稱
 *      remarks;//	備註
 */
export const f2100201_res_01 = {
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
            "@xmlns:f21": "http://mnb.hitrust.com/service/schema/f2100201",
            "@xsi:type": "f21:f2100201ResultType",
            "f21:realBal": "100.00",
            "f21:usefulBal": "100.00",
            "f21:saveBookBal": "100.00",
            "f21:freezeBal)": "0.00",
            "f21:distrainBal": "0.00",
            "f21:details": {
                "f21:detail": [
                    {
                        "f21:transDate": "20181208",
                        "f21:digest": "利息",
                        "f21:withdraw": "",
                        "f21:deposit": "0",
                        "f21:balance": "2986",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "合庫西湖",
                        "f21:currency": "USD",
                        "f21:currName": "美金",
                        "f21:remarks": "$0(稅)"
                    },
                    {
                        "f21:transDate": "20181207",
                        "f21:digest": "跨行存款",
                        "f21:withdraw": "",
                        "f21:deposit": "1985",
                        "f21:balance": "2986",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "中國信託商業銀行",
                        "f21:currency": "USD",
                        "f21:currName": "美金",
                        "f21:remarks": "51049999999996"
                    },
                    {
                        "f21:transDate": "20181206",
                        "f21:digest": "提領",
                        "f21:withdraw": "1000",
                        "f21:deposit": "",
                        "f21:balance": "1001",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "合庫西湖",
                        "f21:currency": "USD",
                        "f21:currName": "美金",
                        "f21:remarks": ""
                    },
                    {
                        "f21:transDate": "20101208",
                        "f21:digest": "degs",
                        "f21:withdraw": "",
                        "f21:deposit": "",
                        "f21:balance": "300",
                        "f21:rcvBankId": "001",
                        "f21:rcvBankName": "合庫營",
                        "f21:currency": "USD1010101",
                        "f21:currName": "美金",
                        "f21:remarks": "remarks"
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
