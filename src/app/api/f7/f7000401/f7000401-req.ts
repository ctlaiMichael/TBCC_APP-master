import { ReqBody } from '@base/api/model/req-body';

export class F7000401ReqBody extends ReqBody {
	custId = '';          // 身分證字號
	customerId = '';      // 電話號碼所屬身分證號
	phone = '';           // 電話號碼
	constructor() {
		super();
	}
}
