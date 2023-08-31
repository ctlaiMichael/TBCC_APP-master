/**
 * [模擬]台幣帳戶定存交易明細查詢
 * <f21:details><f21:detail>
 *      <f21:depositNo>1234567</f21:depositNo>
 *      <f21:startAcctDate>0990609</f21:startAcctDate>
 *      <f21:endAcctDate>1000609</f21:endAcctDate>
 *      <f21:rate>1.340</f21:rate>
 *      <f21:rateType>1</f21:rateType>
 *      <f21:rateTypeName>機動</f21:rateTypeName>
 *      <f21:interestType>3</f21:interestType>
 *      <f21:interestTypeName>整存整付</f21:interestTypeName>
 *      <f21:balance1/>
 *      <f21:fdType>同存定期郵局</f21:fdType>
 *      <f21:saveListBal>5000000000.00</f21:saveListBal>
 *      <f21:interestIncome>0.00</f21:interestIncome>
 *      <f21:depositDay>0012</f21:depositDay>
 *      <f21:distrainBal>0.00</f21:distrainBal>
 *      <f21:collateralType>無</f21:collateralType>
 *      <f21:autoTransSet>到期解約</f21:autoTransSet>
 *      <f21:transDate/>
 *      <f21:transAmount/>
 *      <f21:taxAmount/>
 * </f21:detail></f21:details>
 *	xsi="http://www.w3.org/2001/XMLSchema-instance">
 */

export const f2100102_res_01 = {
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
            "@xmlns:f21": "http://mnb.hitrust.com/service/schema/f2100102",
            "@xsi:type": "f21:f2100102ResultType",

            "f21:details": {
                "f21:detail": [
                    {
                        "depositNo": "1234567",
                        "startAcctDate": "0990609",
                        "endAcctDate": "1000609",
                        "rate": "1.340",
                        "rateType": "1",
                        "rateTypeName": "機動",
                        "interestType": "3",
                        "interestTypeName": "整存整付",
                        "balance1": "",
                        "fdType": "同存定期郵局",
                        "saveListBal": "5000000000.00",
                        "interestIncome": "0.00",
                        "depositDay": "0012",
                        "distrainBal": "0.00",
                        "collateralType": "無",
                        "autoTransSet": "到期解約",
                        "transDate": "",
                        "transAmount": "",
                        "taxAmount": ""
                    },
                    {
                        "f21:depositNo": "",
                        "f21:startAcctDate": "1040119",
                        "f21:endAcctDate": "1050119",
                        "f21:rate": "1.340",
                        "f21:rateType": "0",
                        "f21:rateTypeName": "固定",
                        "f21:interestType": "1",
                        "f21:interestTypeName": "按月付息",
                        "f21:balance1": "100000.00",
                        "f21:fdType": "同存定期郵局",
                        "f21:saveListBal": "100000.00",
                        "f21:interestIncome": "0.00",
                        "f21:depositDay": "0001",
                        "f21:distrainBal": "0.00",
                        "f21:collateralType": "本行設質",
                        "f21:autoTransSet": "到期解約",
                        "f21:transDate": "1000222",
                        "f21:transAmount": "100000.00",
                        "f21:taxAmount": "0.00",
                    },
                    {
                        "f21:depositNo": "1111111",
                        "f21:startAcctDate": "1000222",
                        "f21:endAcctDate": "1000322",
                        "f21:rate": "1.340",
                        "f21:rateType": "0",
                        "f21:rateTypeName": "固定",
                        "f21:interestType": "1",
                        "f21:interestTypeName": "按月付息",
                        "f21:balance1": "100000.00",
                        "f21:fdType": "定存－一個月",
                        "f21:saveListBal": "100000.00",
                        "f21:interestIncome": "0.00",
                        "f21:depositDay": "0001",
                        "f21:distrainBal": "0.00",
                        "f21:collateralType": "本行設質",
                        "f21:autoTransSet": "到期解約",
                        "f21:transDate": "1000222",
                        "f21:transAmount": "100000.00",
                        "f21:taxAmount": "0.00",
                    },
                    {
                        "f21:depositNo": "",
                        "f21:startAcctDate": "1000222",
                        "f21:endAcctDate": "1000322",
                        "f21:rate": "1.340",
                        "f21:rateType": "0",
                        "f21:rateTypeName": "固定",
                        "f21:interestType": "1",
                        "f21:interestTypeName": "整存整付",
                        "f21:balance1": "100000.00",
                        "f21:fdType": "定存－一個月",
                        "f21:saveListBal": "100000.00",
                        "f21:interestIncome": "0.00",
                        "f21:depositDay": "0001",
                        "f21:distrainBal": "0.00",
                        "f21:collateralType": "本行設質",
                        "f21:autoTransSet": "到期解約",
                        "f21:transDate": "1000222",
                        "f21:transAmount": "100000.00",
                        "f21:taxAmount": "0.00",
                    },
                    {
                        "f21:depositNo": "2223335",
                        "f21:startAcctDate": "1000222",
                        "f21:endAcctDate": "1000322",
                        "f21:rate": "1.340",
                        "f21:rateType": "0",
                        "f21:rateTypeName": "固定",
                        "f21:interestType": "1",
                        "f21:interestTypeName": "按月付息",
                        "f21:balance1": "100000.00",
                        "f21:fdType": "定存－一個月",
                        "f21:saveListBal": "100000.00",
                        "f21:interestIncome": "0.00",
                        "f21:depositDay": "0001",
                        "f21:distrainBal": "0.00",
                        "f21:collateralType": "本行設質",
                        "f21:autoTransSet": "到期解約",
                        "f21:transDate": "1000222",
                        "f21:transAmount": "100000.00",
                        "f21:taxAmount": "0.00",
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
