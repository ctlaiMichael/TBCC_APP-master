export const f9000301_res_01 = {
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


      "@xmlns:f90": "http://mnb.hitrust.com/service/schema/f9000301",
      "@xsi:type": "f90:f9000301ResultType",

      "f90:details":
    //    null
      {
        "f90:detail": [
          {
            "f90:borrowAccount": "9997892000121",
            "f90:oriBorrowCapital": "1000000",
            "f90:nowBorrowCapital": "924961",
            "f90:lastInterRecDay": "1000516",
            "f90:lowestAmount": "4716",
            "f90:totalAmount": "37775",
            "f90:payType": "2",
            "f90:payTypeDesc": "尚未逾期",
          },
          {
            "f90:borrowAccount": "5399046011213",
            "f90:oriBorrowCapital": "6,500,000.00",
            "f90:nowBorrowCapital": "1,500,000.00",
            "f90:lastInterRecDay": "1000423",
            "f90:lowestAmount": "25,000.00",
            "f90:totalAmount": "28,000.00",
            "f90:payType": "1",
            "f90:payTypeDesc": "已逾繳息日",
          },
          {
            "f90:borrowAccount": "4553045984573",
            "f90:oriBorrowCapital": "25,000.00",
            "f90:nowBorrowCapital": "924961",
            "f90:lastInterRecDay": "1000315",
            "f90:lowestAmount": "5,000.00",
            "f90:totalAmount": "5,000.00",
            "f90:payType": "2",
            "f90:payTypeDesc": "尚未逾期",
          },
          {
            "f90:borrowAccount": "9997892000121",
            "f90:oriBorrowCapital": "1000000",
            "f90:nowBorrowCapital": "924961",
            "f90:lastInterRecDay": "1000516",
            "f90:lowestAmount": "4716",
            "f90:totalAmount": "37775",
            "f90:payType": "3",
            "f90:payTypeDesc": "已逾到期日",
          },

        ]
      },
    }
  }
};
