import { ReqBody } from '@base/api/model/req-body';

export class F7000201ReqBody extends ReqBody {
    custId =  '';         // 身分證字號
    account =  '';        // 扣款帳號
    dueDate =  '';        // 代收期限
    bussNO =  '';         // 銷帳編號
    payAmount =  '';      // 應繳總金額
    chkcode = '';         // 查核碼
    businessType =  '';   // 次營業日註記
    trnsToken =  '';      // 交易控制碼
    constructor() {
        super();
    }
}
