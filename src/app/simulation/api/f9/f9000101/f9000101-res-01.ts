export const f9000101_res_01 = {
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


      "@xmlns:f90": "http://mnb.hitrust.com/service/schema/f9000101",
      "@xsi:type": "f90:f9000101ResultType",


      "f90:totalAmount": 26000000.00,
      "f90:details": 
    //   null,
      {
        "f90:detail": [
          {
            "f90:acctNo": "9997892000121",
            "f90:balence": "10000.00",
            "f90:rate": "1.197",
            "f90:lastInterRecDate": "0991016",
            "f90:expirDate": "1180216",
          },
          {
            "f90:acctNo": "5399046-011213",
            "f90:balence": "5000000.00",
            "f90:rate": "1.456",
            "f90:lastInterRecDate": "0990916",
            "f90:expirDate": "1180116",
          },
          {
            "f90:acctNo": "4553045984573",
            "f90:balence": "6500000.00",
            "f90:rate": "1.650",
            "f90:lastInterRecDate": "0990816",
            "f90:expirDate": "1180105",
          }

        ]
      },

      "paginatedInfo": {
        "totalRowCount": "10"
        , "pageSize": "3"
        , "pageNumber": "1"
        , "sortColName": ""
        , "sortDirection": "ASC"
      }
    }
  }
};
