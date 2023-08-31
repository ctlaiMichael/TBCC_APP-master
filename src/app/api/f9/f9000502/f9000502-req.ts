import { ReqBody } from '@base/api/model/req-body';

export class F9000502ReqBody extends ReqBody {
	custId = '';         // 身分證字號
	ebkcaseno = '';      // 案件編號
	isStaff = ''; 		 // 是否為員工
	aprprdbgn = '';      // 借款期間(起日)(線上對保:網銀填入 親赴分行對保:ELOAN結案寫YYYMMDD)
	aprprdend = '';      // 借款期間(迄日)(起日+核准期間(AP算)YYYMMDD)
	singAgree = '';      // 客戶是否同意核准條件(Y: 同意 N: 不同意)
	singKind = '';       // 客戶選擇簽約對保方式(1: 線上簽約對保,2: 本人親赴分行簽約對保)
	singelDate = '';     // 指定撥貸日期 (YYYY - MM - DD,選擇線上簽約對保時由客戶輸入，選擇親赴分行則由分行經辦輸入)
	blobData = '';		// 合約HTML BASE64ENCODE\
	blobDataStaff = '';		// 員工合約HTML BASE64ENCODE\
	phoneNum = '';
	trnsToken = ''; 
constructor() {
	super();
}
}

