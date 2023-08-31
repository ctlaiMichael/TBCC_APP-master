import { ReqBody } from '@base/api/model/req-body';

export class F9000409ReqBody extends ReqBody {
  custId = ''; //客戶統一編號
  crdate = ''; //案件建立日期
  ebkcaseno = ''; //網銀案件編號
  txkind = ''; //申請種類
  branchId = ''; //受理分行代號
  branchName = ''; //受理分行中文名稱
  giveAmt = ''; //申請金額
  giveDurYymm = ''; //貸款期間
  loanUsage = ''; //資金用途
  refundWay = ''; //償還方式
  graveYymm = ''; //本金寬緩期
  repName = ''; //申請人姓名
  repName_long = ''; //長戶名 *新增
  sex = ''; //性別
  applyBir = ''; //出生日期
  levelOfEducation = ''; //教育程度
  maritalStatus = ''; //婚姻狀況
  supportChildren = ''; //扶養子女數
  applyTelSun = ''; //聯絡電話（日） =>戶籍電話
  applyTelNight = ''; //聯絡電話（夜）=>現住電話
  applyTelWalk = ''; //聯絡電話（行動）
  applyTelFax = ''; //傳真電話
  eMail = ''; //電子信箱
  houseStatus = ''; //住宅狀況
  homeownership2 = ''; //住宅狀況-設質情形
  houseDurYymm = ''; //現在房屋居住期間
  applyHouseAddr = ''; //戶籍地址
  applyAddr = ''; //通訊地址註記
  applyLiveAddr = ''; //通訊地址
  applyServeUnit = ''; //公司名稱
  applyBussitem = ''; //營業項目
  applyWorker = ''; //員工人數
  applyTelFirm = ''; //公司電話
  applyTelExt = ''; //公司電話分機
  applyDept = ''; //所屬部門
  applyTrade = ''; //行業別
  metier = ''; //職業別細項
  metier_sub = ''; //職業別分項
  applyFirmAddr = ''; //公司地址
  applyPost = ''; //擔任職務
  applyServeYymm = ''; //服務年資
  applyServeMm = ''; //服務年資-月  **(新追加)
  serverdur = ''; //現職服務年資
  serverdurMm = ''; //現職服務年資-月  **(新追加)
  mYear = ''; //最近財務收支年度
  applyNt = ''; //年收入-本人
  spouseNt = ''; //年收入-配偶
  totalNt = ''; //年收入-合計(家庭)
  expense = ''; //年支出(家庭)
  frmPaylist = ''; //繳息清單寄發註記
  account = ''; //指定撥入帳號
  accountbrid = ''; //指定撥入帳號分行代號
  accountbrcn = ''; //指定撥入帳號分行名稱
  accountcd = ''; //指定撥入帳號科目中文
  acctno = ''; //原放款帳號
  rate = ''; //利率 **(新追加)
  kycyn = ''; //本人識字且採用國語作為本次個人貸款客戶K Y C表之填答方式
  kycloanUsage = ''; //借款用途
  kycold = ''; //年齡
  kycetch = ''; //票據帳戶使用狀況
  kycetchno = ''; //票據帳戶使用狀況-退票未註銷張數
  kycbankel = ''; //銀行貸款狀況
  kyccard = ''; //信用卡使用狀況
  kycpaymo = ''; //銀行貸款每月應繳金額
  kycelamt = ''; //貸款餘額
  kycelmo = ''; //原貸款總金
  kycko = ''; //本人已填妥「個人貸款客戶KYC表」無誤
  agree = ''; //客戶同意事項文件種類+是否同意或取得(Y/N/O)內容版號
  agreeJc = ''; //是否同意查詢聯徵
  agreeJcVer = ''; //是否同意查詢聯徵版號
  agreeCt = ''; //是否同意借款契約
  agreeCtVer = ''; //是否同意借款契約版號
  agreeTr = ''; //是否同意約定條款
  agreeTrVer = ''; //是否同意約定條款版號
  agreeCm = ''; //是否同意共同行銷
  agreeCmVer = ''; //是否同意共同行銷版號
  agreeCp = ''; //是否同意專人聯絡
  companyId = ''; //公司統編
  relationKind1 = ''; //關係註記1
  relationKind2 = ''; //關係註記2
  relationKind3 = ''; //關係註記3
  trnsToken = ''; //交易控制碼

  constructor() {
    super();
  }
}

