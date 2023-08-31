import { ReqBody } from '@base/api/model/req-body';

export class F7000501ReqBody extends ReqBody {
	custId = '';           // 身分證字號
	account = '';          // 扣款帳號
	barcode1 = '';         // 條碼1
	barcode2 = '';         // 條碼2
	barcode3 = '';         // 條碼3
	businessType = '';     // 次營業日註記
	trnsToken = '';        // 交易控制碼
	constructor() {
		super();
	}
}
