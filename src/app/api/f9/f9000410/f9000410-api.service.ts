import { FormateService } from '@shared/formate/formate.service';
import { Injectable, Output } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { F9000410ReqBody } from './f9000410-req';
import { F9000410ResBody } from './f9000410-res';
import { MortgageIncreaseService } from '@pages/online-loan/shared/service/mortgage-increase.service';

@Injectable()
export class F9000410ApiService extends ApiBase<F9000410ReqBody, F9000410ResBody> {

  constructor(
    public telegram: TelegramService<F9000410ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    public _formateService: FormateService,
    private _logger: Logger,
    private _allService: MortgageIncreaseService
  ) {
    super(telegram, errorHandler, 'F9000410');

  }

  sendData(req: any, reqHeader?: any): Promise<any> {
    let data = new F9000410ReqBody();
    data.custId = req.custId; //客戶統一編號
    data.crdate = req.crdate; //案件建立日期
    data.ebkcaseno = req.ebkcaseno; //網銀案件編號
    data.txkind = req.txkind; //申請種類
    data.branchId = req.branchId; //受理分行代號
    data.branchName = req.branchName; //受理分行中文名稱
    data.giveAmt = req.giveAmt; //申請金額
    data.giveDurYymm = req.giveDurYymm; //貸款期間
    data.loanUsage = req.loanUsage; //資金用途
    data.refundWay = req.refundWay; //償還方式
    data.graveYymm = req.graveYymm; //本金寬緩期
    data.repName = req.repName; //申請人姓名
    data.sex = req.sex; //性別
    data.applyBir = req.applyBir; //出生日期
    data.levelOfEducation = req.levelOfEducation; //教育程度
    data.maritalStatus = req.maritalStatus; //婚姻狀況
    data.supportChildren = req.supportChildren; //扶養子女數
    data.applyTelSun = req.applyTelSun; //聯絡電話（日）
    data.applyTelNight = req.applyTelNight; //聯絡電話（夜）
    data.applyTelWalk = req.applyTelWalk; //聯絡電話（行動）
    data.applyTelFax = req.applyTelFax; //傳真電話
    data.eMail = req.eMail; //電子信箱
    data.houseStatus = req.houseStatus; //住宅狀況
    data.homeownership2 = req.homeownership2; //住宅狀況-設質情形
    data.houseDurYymm = req.houseDurYymm; //現在房屋居住期間
    data.applyHouseAddr = req.applyHouseAddr; //戶籍地址
    data.applyAddr = req.applyAddr; //通訊地址註記
    data.applyLiveAddr = req.applyLiveAddr; //通訊地址
    data.applyServeUnit = req.applyServeUnit; //公司名稱
    data.applyBussitem = req.applyBussitem; //營業項目
    data.applyWorker = req.applyWorker; //員工人數
    data.applyTelFirm = req.applyTelFirm; //公司電話
    data.applyTelExt = req.applyTelExt; //公司電話分機
    data.applyDept = req.applyDept; //所屬部門
    data.applyTrade = req.applyTrade; //行業別
    data.metier = req.metier; //職業別細項
    data.metier_sub = req.metier_sub; //職業別分項
    data.applyFirmAddr = req.applyFirmAddr; //公司地址
    data.applyPost = req.applyPost; //擔任職務
    data.applyServeYymm = req.applyServeYymm; //服務年資
    data.applyServeMm = req.applyServeMm; //服務年資(月)
    data.serverdur = req.serverdur; //現職服務年資
    data.serverdurMm = req.serverdurMm; //現職服務年資(月)
    data.mYear = req.mYear; //最近財務收支年度
    data.applyNt = req.applyNt; //年收入-本人
    data.spouseNt = req.spouseNt; //年收入-配偶
    data.totalNt = req.totalNt; //年收入-合計(家庭)
    data.expense = req.expense; //年支出(家庭)
    data.frmPaylist = req.frmPaylist; //繳息清單寄發註記
    data.account = req.account; //指定撥入帳號
    data.accountbrid = req.accountbrid; //指定撥入帳號分行代號
    data.accountbrcn = req.accountbrcn; //指定撥入帳號分行名稱
    data.accountcd = req.accountcd; //指定撥入帳號科目中文
    data.acctno = req.acctno; //原放款帳號
    data.kycyn = req.kycyn; //本人識字且採用國語作為本次個人貸款客戶K Y C表之填答方式
    data.kycloanUsage = req.kycloanUsage; //借款用途
    data.kycold = req.kycold; //年齡
    data.kycetch = req.kycetch; //票據帳戶使用狀況
    data.kycetchno = req.kycetchno; //票據帳戶使用狀況-退票未註銷張數
    data.kycbankel = req.kycbankel; //銀行貸款狀況
    data.kyccard = req.kyccard; //信用卡使用狀況
    data.kycpaymo = req.kycpaymo; //銀行貸款每月應繳金額
    data.kycelamt = req.kycelamt; //貸款餘額
    data.kycelmo = req.kycelmo; //原貸款總金額
    data.kycko = req.kycko; //本人已填妥「個人貸款客戶KYC表」無誤
    data.agree = req.agree; //客戶同意事項文件種類+是否同意或取得(Y/N/O)內容版號
    data.agreeJc = req.agreeJc; //是否同意查詢聯徵
    data.agreeJcVer = req.agreeJcVer; //是否同意查詢聯徵版號
    data.agreeCt = req.agreeCt; //否同意借款契約
    data.agreeCtVer = req.agreeCtVer; //是否同意借款契約版號
    data.agreeTr = req.agreeTr; //是否同意約定條款
    data.agreeTrVer = req.agreeTrVer; //是否同意約定條款版號
    data.agreeCm = req.agreeCm; //是否同意共同行銷
    data.agreeCp = req.agreeCp; //否同意專人聯絡
    data.agreeCmVer = req.agreeCmVer; //是否同意共同行銷版號
    data.companyId = req.companyId; //客戶統編
    data.relationKind1 = req.relationKind1; //關係註記1
    data.relationKind2 = req.relationKind2; //關係註記2
    data.relationKind3 = req.relationKind3; //關係註記3
    data.trnsToken = req.trnsToken; //交易控制碼

    //req formate處理，ex:金額*10000
    let result_data = this._allService.formateReqData(data);
    this._logger.log("result_data:", this._formateService.transClone(result_data));

    //申請種類防呆
    if (typeof result_data.txkind == 'undefined' || result_data.txkind == null || result_data.txkind == '') {
      this._logger.log("into cant find result_data.txkind");
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: '查無申請種類'
      });
    }

    let output = {
      status: false,
      result: '', //成功0 失敗1
      respCode: '', //電文回應代碼
      respCodeMsg: '', //電文代碼說明
      info_data: {},
      resultStatus: '', //result !=4001 or result != 0
      ebkCaseNo: ''
    };

    this._logger.log("result_data:", result_data);
    return super.send(result_data).then(
      (resObj) => {
        this._logger.log("resObj:", resObj);
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.log('jsonObj:', jsonObj);
        output.info_data = jsonObj;
        output.result = jsonObj.result;
        this._logger.log("jsonObj.result:", jsonObj.result);
        output.respCode = jsonObj.respCode;
        output.respCodeMsg = jsonObj.respCodeMsg;
        this._logger.log("api return output:", this._formateService.transClone(output));
        output.ebkCaseNo = resObj['txNo']; //案件編號
        output.status = true;
        return Promise.resolve(output);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }
}




