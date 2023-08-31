import { ReqBody } from '@base/api/model/req-body';

export class FH000205ReqBody extends ReqBody {
    custId = '';
    sendSeqNo = '';
    refNo = '';
    rcode = '';
    rcMsg = '';
    bankIdFrom = '';
    acctIdFrom = '';
    trnsDt = '';
    dueDt = '';
    txnSeqNo='';
    payTxnFee = '';
    mac = '';
    constructor() {
        super();
    }
}
