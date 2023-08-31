import { ReqBody } from '@base/api/model/req-body';

export class F7000101ReqBody extends ReqBody {
	custId = '';           // 身分證字號
	trnsfrOutAccnt = '';   // 扣款帳號
	payCategory = '';      // 繳款類別
	payNo = '';            // 銷帳編號
	payEndDate = '';       // 繳款期限
	trnsfrAmount = '';     // 繳納金額
	businessType = '';     // 次營業日註記
	taxType = '';          // 稅別
	trnsToken = '';        // 交易控制碼
	constructor() {
		super();
	}
}
