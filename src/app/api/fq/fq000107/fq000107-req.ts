import { ReqBody } from '@base/api/model/req-body';

export class FQ000107ReqBody extends ReqBody {
    custId = '';
    trnsfrOutBank = '';
    trnsfrOutAcct = '';
    txnAmt = '';
    secureCode = '';
    txnCurrencyCode = '';
    acqInfo = '';
    deadlinefinal = '';
    noticeNbr = '';
    otherInfo = '';
    qrExpirydate = '';
    feeInfo = '';
    charge = '';
    feeName = '';
    merchantName = '';
    feeKind = '';
    typeAndFee = '';
    feeSessionId = '';
    trnsToken = '';

    constructor() {
        super();
    }

}

