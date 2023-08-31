import { ReqBody } from '@base/api/model/req-body';

export class FH000302ReqBody extends ReqBody {
	hospitalId = '';
	branchId = '';
	constructor() {
		super();
	}
}