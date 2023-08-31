export const f9000201_res_01 = {
  "MNBResponse": {
    "@xmlns:": "http://mnb.hitrust.com/service/schema",
    "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "resHeader": {
      "requestNo": "2010_12_22_13_32_21_531_12345",
      "requestTime": "2010-12-22T13:32:21.578+08:00",
      "responseTime": "2010-12-22T13:32:21.750+08:00",
      "custId": null
    },
    "result": {


      "@xmlns:f90": "http://mnb.hitrust.com/service/schema/f9000201",
      "@xsi:type": "f90:f9000201ResultType",

      "f90:balance": "924961.00",
      "f90:nowRate": "1.337",
      "f90:loanCredit": "1000000.00",
      "f90:loanDate": "0980216",
      "f90:expirDate": "1180216",
      "f90:ltrateDueDate": "0991016",
      "f90:isranDueDate": "0000000",
      "f90:aupayAccount": "aupayAccount Value",
      "f90:anuMonPay": "32795.00",
      "f90:details":
        // null,
        {
          "f90:detail": [
            {
              "f90:transDay": "1070822",
              "f90:capitalBal": "233338.00",
              "f90:digest": "網路轉入",
              "f90:captilPay": "1425.00",
              "f90:ratePay": "495.00",
              "f90:breakFee": "0.00",
              "f90:delayRate": "2.00",
              "f90:startDate": "1070631",
              "f90:endDate": "1070731",
              "f90:rateCountdays": "30",
              "f90:rate": "2.530",
              "f90:delayDays": "22"
            },
            {
              "f90:transDay": "100412",
              "f90:capitalBal": "58949.00",
              "f90:digest": "NTDN",
              "f90:captilPay": "",
              "f90:ratePay": "8664.00",
              "f90:breakFee": "12.00",
              "f90:delayRate": "58.00",
              "f90:startDate": "0981216",
              "f90:endDate": "0990116",
              "f90:rateCountdays": "030",
              "f90:rate": "1.077",
              "f90:delayDays": "481",
            },
            {
              "f90:transDay": "1000512",
              "f90:capitalBal": "958949.00",
              "f90:digest": "NTDN",
              "f90:captilPay": "",
              "f90:ratePay": "864.00",
              "f90:breakFee": "12.00",
              "f90:delayRate": "58.00",
              "f90:startDate": "0981216",
              "f90:endDate": "0990116",
              "f90:rateCountdays": "030",
              "f90:rate": "1.077",
              "f90:delayDays": "481",
            }


          ]
        },
      "paginatedInfo": {
        "totalRowCount": "3"
        , "pageSize": "2"
        , "pageNumber": "1"
        , "sortColName": ""
        , "sortDirection": "ASC"
      }
    }
  }
};
