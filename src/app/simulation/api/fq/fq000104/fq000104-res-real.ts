let tmp_list = {};
// 繳費-繳卡費
tmp_list['pay-card'] = {
    "MNBResponse": {
        "@xmlns": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "5b3dc689f789e40d3e2e1aaa-fq000104",
            "requestTime": "2019-07-12T15:49:49.652+08:00",
            "responseTime": "2019-07-12T15:49:50.225+08:00",
            "custId": "B121194483"
        },
        "result": {
            "@xsi:type": "fq0:fq000104ResultType",
            "@xmlns:fq0": "http://mnb.hitrust.com/service/schema/fq000104",
            "fq0:trnsRsltCode": "0",
            "fq0:merchantName": "462QRCODE測試店",
            "fq0:countryCode": "158",
            "fq0:trnsType": "03",
            "fq0:version": "V1",
            "fq0:txnAmt": "30000",
            "fq0:canAmtEdit": "Y",
            "fq0:secureCode": "AeyysARXl7ad",
            "fq0:deadlinefinal": "20170731",
            "fq0:noticeNbr": "1234567890123456",
            "fq0:otherInfo": "信用卡費",
            "fq0:txnCurrencyCode": "901",
            "fq0:acqInfo": "00,4624622630156100011000100300000010",
            "fq0:qrExpirydate": "20201231123030",
            "fq0:feeInfo": null,
            "fq0:charge": "1100",
            "fq0:feeName": null
        }
    }
};


// 繳費-中華電信
tmp_list['CHT'] = {
    "MNBResponse": {
        "@xmlns": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "5b3dc689f789e40d3e2e1aaa-fq000104",
            "requestTime": "2019-07-12T15:49:49.652+08:00",
            "responseTime": "2019-07-12T15:49:50.225+08:00",
            "custId": "B121194483"
        },
        "result": {
            "@xsi:type": "fq0:fq000104ResultType",
            "@xmlns:fq0": "http://mnb.hitrust.com/service/schema/fq000104",
            "fq0:trnsRsltCode": "0",
            "fq0:hostCode": '',
			"fq0:hostCodeMsg": '',
            "fq0:merchantName": "測試中華電信費",
            "fq0:countryCode": "158",
            "fq0:trnsType": "03",
            "fq0:version": "V1",
            "fq0:txnAmt": "109900",
            "fq0:canAmtEdit": "Y",
            "fq0:secureCode": "AXQ4/8YB611s",
            "fq0:deadlinefinal": null,
            "fq0:noticeNbr": "++72+++++Y514979",
            "fq0:otherInfo": null,
            "fq0:txnCurrencyCode": null,
            "fq0:acqInfo": "00,0040041000006700010001000100067805",
            "fq0:qrExpirydate": null,
            "fq0:feeInfo": "5,0707,11,070820001",
            "fq0:charge": "000",
            "fq0:feeName": null
        }
    }
};


// outbound1
tmp_list['outbound1'] = {
    "MNBResponse": {
        "@xmlns": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "5b3dc689f789e40d3e2e1aaa-fq000104",
            "requestTime": "2019-07-12T15:49:49.652+08:00",
            "responseTime": "2019-07-12T15:49:50.225+08:00",
            "custId": "B121194483"
        },
        "result": {
            "@xsi:type": "fq0:fq000104ResultType",
            "@xmlns:fq0": "http://mnb.hitrust.com/service/schema/fq000104",
            "fq0:trnsRsltCode": "0",
            "fq0:merchantName": "462QRCODE測試店",
            "fq0:countryCode": "158",
            "fq0:trnsType": "01",
            "fq0:version": "V1",
            "fq0:txnAmt": "30000",
            "fq0:canAmtEdit": "N",
            "fq0:secureCode": "AeyysARXl7ad",
            "fq0:deadlinefinal": "20170731",
            "fq0:noticeNbr": "1234567890123456",
            "fq0:otherInfo": "",
            "fq0:txnCurrencyCode": "901",
            "fq0:acqInfo": "11,4624622630156100011000100300000010",
            "fq0:qrExpirydate": "20201231123030",
            "fq0:feeInfo": null,
            "fq0:charge": null,
            "fq0:feeName": null
        }
    }
};
//outbound2
tmp_list['outbound2'] = {
    "MNBResponse": {
        "@xmlns": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "5b3dc689f789e40d3e2e1aaa-fq000104",
            "requestTime": "2019-07-12T15:49:49.652+08:00",
            "responseTime": "2019-07-12T15:49:50.225+08:00",
            "custId": "B121194483"
        },
        "result": {
            "@xsi:type": "fq0:fq000104ResultType",
            "@xmlns:fq0": "http://mnb.hitrust.com/service/schema/fq000104",
            "fq0:trnsRsltCode": "0",
            "fq0:merchantName": "462QRCODE測試店",
            "fq0:countryCode": "158",
            "fq0:trnsType": "03",
            "fq0:version": "V1",
            "fq0:txnAmt": "30000",
            "fq0:canAmtEdit": "N",
            "fq0:secureCode": "AeyysARXl7ad",
            "fq0:deadlinefinal": "20170731",
            "fq0:noticeNbr": "1234567890123456",
            "fq0:otherInfo": "",
            "fq0:txnCurrencyCode": "901",
            "fq0:acqInfo": "11,4624622630156100011000100300000010",
            "fq0:qrExpirydate": "20201231123030",
            "fq0:feeInfo": null,
            "fq0:charge": null,
            "fq0:feeName": null
        }
    }
};

//outbound2
tmp_list['P2P'] = {
    "MNBResponse": {
        "@xmlns": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "5b3dc689f789e40d3e2e1aaa-fq000104",
            "requestTime": "2019-07-12T15:49:49.652+08:00",
            "responseTime": "2019-07-12T15:49:50.225+08:00",
            "custId": "B121194483"
        },
        "result": {"@xmlns:fq0" : "http://mnb.hitrust.com/service/schema/fq000104","@xsi:type" : "fq0:fq000104ResultType","fq0:trnsRsltCode" : "0","fq0:trnsType" : "02","fq0:version" : "V1","fq0:txnAmt" : "0","fq0:canAmtEdit" : "Y","fq0:transfereeBank" : "006","fq0:transfereeAccount" : "0009997872063037","fq0:note" : null,"fq0:txnCurrencyCode" : null}}};

//tax
tmp_list['tax'] = {
    "MNBResponse" : {
        "@xmlns" : "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi" : "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader" : {
         "requestNo" : "e283d95c070b322aeda8a7e7-fq000104",
         "requestTime" : "2019-07-31T13:03:22.364+08:00",
         "responseTime" : "2019-07-31T13:03:23.113+08:00",
         "custId" : "B121194483"
        },
        "result" : {
         "@xmlns:fq0" : "http://mnb.hitrust.com/service/schema/fq000104",
         "@xsi:type" : "fq0:fq000104ResultType",
         "fq0:trnsRsltCode" : "0",
         "fq0:merchantName" : "462QRCODE測試店",
         "fq0:countryCode" : "158",
         "fq0:trnsType" : "01",
         "fq0:version" : "V1",
         "fq0:txnAmt" : null,
         "fq0:orderNbr" : "00620190731005939",
         "fq0:secureCode" : "AeN2ibPXQKgp",
         "fq0:transfereeBank" : "462",
         "fq0:transfereeAccount" : "4622630156100041",
         "fq0:txnCurrencyCode" : "901",
         "fq0:acqInfo" : "51,46246226301561000410001001",
         "fq0:qrExpirydate" : "20201231123030"
        }
       }   
};

// 如邑堂
tmp_list['emv_cookie'] = {
    "MNBResponse": {
        "@xmlns": "http://mnb.hitrust.com/service/schema",
        "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "resHeader": {
            "requestNo": "5b3dc689f789e40d3e2e1aaa-fq000104",
            "requestTime": "2019-07-12T15:49:49.652+08:00",
            "responseTime": "2019-07-12T15:49:50.225+08:00",
            "custId": "B121194483"
        },
        "result": {
            "@xsi:type": "fq0:fq000104ResultType",
            "@xmlns:fq0": "http://mnb.hitrust.com/service/schema/fq000104",
            "fq0:trnsRsltCode": "0",
            "fq0:merchantName": "如邑堂",
            "fq0:countryCode": 150,
            "fq0:trnsType": "01",
            "fq0:version": "V1",
            "fq0:txnAmt": "100",
            "fq0:orderNBr": "00620190916434633",
            "fq0:secureCode": "AYd7oIZvtEM7",
            "fq0:txnCurrencyCode": null,
            "fq0:acqInfo": "01,00600643905420100110010001",
            "fq0:qrExpirydate": null
        }
    }
};


export const fq000104_real = tmp_list;
