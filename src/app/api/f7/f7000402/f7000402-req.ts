import { ReqBody } from '@base/api/model/req-body';

export class F7000402ReqBody extends ReqBody {
	custId = '';           // 身分證字號
	customerId = '';       // 電話號碼所屬身分證號
	areaBranchNo = '';     // 區域局碼  (F7000401_Res. areaBranchNo)
	phone = '';            // 電話號碼  (F7000401_Res. phone)
	authCode = '';         // 授權碼    (F7000401_Res. batchNo)
	billDt = '';           // 出帳年月  (F7000401_Res. billDt)
	billType = '';         // 帳單種類  (F7000401_Res. billType)
	accountType = '';      // 帳類     (F7000401_Res. accountType)
	payableAmount = '';    // 欠費金額  (F7000401_Res.payableAmount)
	checkCode = '';        // 檢查碼    (F7000401_Res. checkCode)
	dueDt = '';            // 繳交期限  (F7000401_Res. dueDt)
	trnsfrOutAccnt = '';   // 扣款帳號
	trnsToken = '';        // 交易控制碼
	constructor() {
		super();
	}
}
