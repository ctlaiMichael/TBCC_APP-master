import { ReqBody } from '@base/api/model/req-body';

export class F7000103ReqBody extends ReqBody {
	custId = '';      // 身分證字號
	taxId = '';       // 可繳交項目代號
	startDate = '';   // 開徵起日
	endDate = '';     // 開徵迄日
	constructor() {
		super();
	}
}
