// 外幣匯率查詢
import { ReqBody } from '@base/api/model/req-body';

export class F5000102ReqBody extends ReqBody {
    custId = '';
    trnsfrOutCurr = '';
    trnsfrOutAmount = '';
    trnsfrInCurr = '';
    trnsfrInAmount = '';
    openNightChk = '';


    constructor() {
        super();
    }
}

