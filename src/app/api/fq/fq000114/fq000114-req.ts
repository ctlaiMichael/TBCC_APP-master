import { ReqBody } from '@base/api/model/req-body';

export class FQ000114ReqBody extends ReqBody {
    custId = '';
    cardNo = '';
    trnsAmount = '';
    countryCode = '';
    txnCurrencyCode = '';
    merchantPan = '';
    mcc = '';
    merchantName = '';
    merchantCity = '';
    postalCode = '';
    billNumber = '';
    mobileNumber = '';
    storeLabel = '';
    loyaltyNumber = '';
    referenceLabel = '';
    customerLabel = '';
    terminalLabel = '';
    purposeOfTransaction = '';
    additionalCDR = '';
    merchantNameByLang = '';
    pfid = '';
    trnsToken = '';
    constructor() {
        super();
    }
}

