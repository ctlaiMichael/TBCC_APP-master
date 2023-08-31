/**
 * [模擬]外幣帳戶定存交易明細查詢
 * <f21:saveListNo>1234567</f21:saveListNo >
 * <f21:saveListBal>-99999999999999.99</f21:saveListBal>
 * <f21:startInterestDay>1000627</f21:startInterestDay>
 * <f21:rateType>0</f21:rateType>
 * <f21:depositDay>30</f21:depositDay>
 * <f21:distrainBal>-99999999999.99</f21:distrainBal>
 * <f21:endAccountDay>1000727</f21:endAccountDay>
 * <f21:rate>999.9999</f21:rate>
 * <f21:details><f21:detail>
 *       <f21:transDate>1000627</f21:transDate>
 *       <f21:balance1>-99999999999.99</f21:balance1> 本金金額
 *       <f21:grossInterest>-99999999999.99</f21:grossInterest> 原幣毛息
 *       <f21:tax>-99999999999.99</f21:tax> 原幣稅
 *       <f21:interest>-99999999999.99</f21:interest> 原幣淨息
 *       <f21:balance2>-99999999999.99</f21:balance2> 續存本金
 * </f21:detail></f21:details>
 *	xsi="http://www.w3.org/2001/XMLSchema-instance">
 */
// export const f2100202_res_01 = {
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
//   };
export const f2100202_res_01 = {
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
            "f21:saveListNo": "0411822",
            "f21:saveListBal": "5004.17",
            "f21:startInterestDay": "1080328",
            "f21:rateType": "0",
            "f21:depositDay": "1080428",
            "f21:distrainBal": "0.00",
            "f21:endAccountDay": "1080428",
            "f21:rate": "1.0",
            "f21:details": 
            // null,
            {
                "f21:detail": [
                    {
                        "f21:transDate": "1000627",
                        "f21:balance1": "99999999999.99",
                        "f21:grossInterest": "99999999999.99",
                        "f21:tax": "99999999999.99",
                        "f21:interest": "99999999999.99",
                        "f21:balance2": "99999999999.99"
                    },
                    {
                        "f21:transDate": "1000623",
                        "f21:balance1": "10000.00",
                        "f21:grossInterest": "5",
                        "f21:tax": "3",
                        "f21:interest": "2",
                        "f21:balance2": "100.01"
                    },
                    {
                        "f21:transDate": "1000623",
                        "f21:balance1": "10000.00",
                        "f21:grossInterest": "5",
                        "f21:tax": "3",
                        "f21:interest": "2",
                        "f21:balance2": "100.01"
                    },
                    {
                        "f21:transDate": "1000623",
                        "f21:balance1": "-10000.00",
                        "f21:grossInterest": "5",
                        "f21:tax": "3",
                        "f21:interest": "2",
                        "f21:balance2": "100.01"
                    },
                    {
                        "f21:transDate": "1000623",
                        "f21:balance1": "10000.00",
                        "f21:grossInterest": "5",
                        "f21:tax": "3",
                        "f21:interest": "2",
                        "f21:balance2": "-100.01"
                    },
                    {
                        "f21:transDate": "1000623",
                        "f21:balance1": "-10000.00",
                        "f21:grossInterest": "5",
                        "f21:tax": "3",
                        "f21:interest": "2",
                        "f21:balance2": "-100.01"
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
