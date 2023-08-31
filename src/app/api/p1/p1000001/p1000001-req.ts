import { ReqBody } from '@base/api/model/req-body';

export class P1000001ReqBody extends ReqBody {
	custId = '';           // 身分證字號
	pushGuid = '';   	   // Push綁定驗證碼
	chatId = '';      		// 訊息編號 多組可用半形逗號隔開
	constructor() {
		super();
	}
}
