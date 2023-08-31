import { ReqBody } from '@base/api/model/req-body';

export class FJ000103ReqBody extends ReqBody {
    custId: string;
    applyAcct: '';
    applyCurr: '';
    custChName: '';
    custEnName: '';
    certDate: '';
    chooseAmt: '';
    applyAmount: '';
    amountLang: '';
    amountPurpose: '';
    addrItem: '';
    sendAddr: '';
    contactPhone: '';
    mobilePhone: '';
    fee: '';
    postFee: '';
    copy: '';
    trnsOutAcct: '';
    email: '';
    trnsToken: '';
    constructor() {
        super();
    }
}

