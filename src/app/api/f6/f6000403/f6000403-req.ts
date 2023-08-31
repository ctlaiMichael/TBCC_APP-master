import { ReqBody } from '@base/api/model/req-body';

export class F6000403ReqBody extends ReqBody {
    custId = '';
    account = '';
    trnsToken = '';
    startDate = '';
    maturityDate = '';
    currencyName = '';
    margin = '';
    tax = '';
    profit = '';
    total = '';
    amount = '';
    trnsfrRate = '';
    interestIncome = '';
    midInt = '';
    insuAmt = '';
    insuAmtTw = '';
    insuRate = '';
    xsAcct = '';
    accountBranch = '';
    agentBranch = '';
    xfdueDate = '';
    xfMmDd = '';
    taxTw = '';
    bACKINTAMT = '';
    arcIssuDate = '';
    arcExpDate = '';
    interestRate = '';
    cancelRate = '';
    intTW = '';
    constructor() {

        super();

        // this.custId = "";
        // this.account = '';
        // this.mBAccNo = '';
    }
}

