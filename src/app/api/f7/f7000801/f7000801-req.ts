import { ReqBody } from '@base/api/model/req-body';

export class F7000801ReqBody extends ReqBody {
	custId = '';           // 身分證字號
	account = '';          // 轉出帳號
	payAmount = '';        // 應繳金額
	bussNO = '';           // 銷帳編號
	businessType = '';     // 次營業日註記
	trnsToken = '';        // 交易控制碼
	constructor() {
		super();
	}
}
