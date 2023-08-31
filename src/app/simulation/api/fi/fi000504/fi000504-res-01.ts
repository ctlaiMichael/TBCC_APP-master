// 基金贖回確認
export const fi000504_res_01 = {
    'MNBResponse': {
        '@xmlns:sch': 'http://mnb.hitrust.com/service/schema',
        'resHeader': {
            'requestNo': '8cdc3aa0be8404e075070cb7-fi000504',
            'requestTime': '2019-03-25T18:37:44.777+08:00',
            'responseTime': '2019-03-25T18:37:44.777+08:00',
            'custId': null
        },

        'result': {
            '@xsi:type': 'fi0:fi000504ResultType',
            '@xmlns:fh0': 'http://mnb.hitrust.com/service/schema/fi000504',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',

            'custId': 'B121194483',
            'hostCode': '4001',
            'hostCodeMsg': '交易成功',
            'trnsRsltCode': '0',
            'trnsDateTime': '1011030142539',
            'item': '贖回',
            'trustAcnt': '0560888015669',
            'transCode': 'CB000177498',
            'fundCode': '2485',
            'fundName': '貝萊德多元資產基金Ａ２美元',
            'investType': '1',
            'investTypeDesc': '單筆',
            'currency': 'USD',
            'inCurrency': 'USD',
            'amount': '1000.00',
            'unit': '11.2983',
            'redeemAmnt': '800.00',
            'redeemUnit': '9.5000',
            'remainAmnt': '200.00',
            'redeemAcnt': '0560888015669',
            'enrollDate': '1011105',
            'effectDate': '1011105',
            'trustFee': '8.00',
            'shortLineAmt': '0.00',
            'redeemType': '2',
            'redeemTypeDesc': '部分贖回',
            'isContinue': 'N',
            'isContinueDesc': '不繼續(終止扣款)',
            'CDSCrate': '999'
        }
    }
};
