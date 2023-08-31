import { ReqBody } from '@base/api/model/req-body';

export class F9000408ReqBody extends ReqBody {
  custId = ''; //身分證字號
  txNo = ''; //案件編號
  funcId = ''; //功能代號
  tvr = ''; //F9000409安控驗證機制
  isId = ''; //是否需要身分證影本
  isFin = ''; //是否需要財力證明
  isWork = ''; //是否需要在職文件證明
  isHouse = ''; //是否需要戶籍證明
  isOther = ''; //是否需要其他文件證明
  idCopy1 = ''; //身分證影本1
  idCopy2 = ''; //身分證影本2
  finProof1 = ''; //財力證明
  workProof1 = ''; //在職文件證明
  houseProof1 = ''; //戶籍證明
  otherProof1 = ''; //其他證明文件
  source = ''; //資料來源

  constructor() {
    super();
  }
}

