import { ReqBody } from '@base/api/model/req-body';

export class FB000711ReqBody extends ReqBody {
    custId = '';
    goldAccount  = '';
    trnsfrOutAccount = '';
    fixAmount6 = '';
    fixAmount16 = '';
    fixAmount26 = '';
    fixFee = '';
    fixCloseDay = '';
    pauseCode = '';
    pauseBeginDay = '';
    pauseEndDay = '';
    fixCode = '';
    trnsToken = '';
    constructor() {
        super();
    }
}
