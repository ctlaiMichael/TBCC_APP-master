import { ReqBody } from '@base/api/model/req-body';

export class F5000110ReqBody extends ReqBody {
  custId = '';
  fnctType = '' ; //交易類別
  negotiatedBranch = '';//議價分行
  negotiatedNo='';//議價編號
  negotiatedCurr='';//議價幣別
  negotiatedRate ='';//議價匯率
  recordDate='';//議價日期
  effectiveDate ='';//議價有效日期
  availableAmount='';//可用金額
  trnsfrAmount='';//轉帳金額
  trnsfrCurr='';//轉帳計價幣別

  constructor() {
    super();
  }
}

