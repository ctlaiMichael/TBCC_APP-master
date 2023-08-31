import { ReqBody } from '@base/api/model/req-body';

export class FQ000117ReqBody extends ReqBody {
    custId = '';
    txnAmt = '';
    txnCurrencyCode = '';
    acqInfo = '';
    deadlinefinal = '';
    noticeNbr = '';
    otherInfo = '';
    qrExpirydate = '';
    feeInfo = '';
    feeName = '';
    merchantName = '';
    feeKind = '';
    typeAndFee = '';
    feeSessionId = '';
    cardNbr = '';
    //cardExpirydate = '';
    trnsToken = '';
    secureCode = '';
    charge = '';
    constructor() {
        super();
    }

}

