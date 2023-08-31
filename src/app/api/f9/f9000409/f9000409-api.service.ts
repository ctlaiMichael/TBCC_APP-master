import { FormateService } from '@shared/formate/formate.service';
import { Injectable, Output } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
import { F9000409ReqBody } from './f9000409-req';
import { F9000409ResBody } from './f9000409-res';
import { MortgageIncreaseService } from '@pages/online-loan/shared/service/mortgage-increase.service';

@Injectable()
export class F9000409ApiService extends ApiBase<F9000409ReqBody, F9000409ResBody> {

  constructor(
    public telegram: TelegramService<F9000409ResBody>,
    public errorHandler: HandleErrorService,
    private authService: AuthService,
    public _formateService: FormateService,
    private _logger: Logger
    , private _allService: MortgageIncreaseService
  ) {
    super(telegram, errorHandler, 'F9000409');

  }

  /**
   * 申請
   * @param set_data 參數設定
   * @param security CheckSecurityService doSecurityNextStep 回傳物件
   */
  sendData(set_data: Object, security: any): Promise<any> {
    /**
     * 參數處理
     */

    let data: any = this.checkSecurity(set_data, true);
    this._logger.log("into before send 409api, data:", data);
    if (!data) {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    let option = this.modifySecurityOption(security);
    if (!option.header) {
      return Promise.reject({
        title: 'ERROR.TITLE',
        content: 'ERROR.DATA_FORMAT_ERROR'
      });
    }
    return this.send(data, option).then(
      (resObj) => {

        let output = {
          status: false,
          result: '', //成功0 失敗1
          respCode: '', //電文回應代碼
          respCodeMsg: '', //電文代碼說明
          txNo: '', //案件編號
          info_data: {},
          msg: '',
          excError: true //其他例外使用，false為有錯誤 ex: respCode!=4001 、 result==1 
        };

        this._logger.log("resObj:", resObj);
        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        this._logger.log('jsonObj:', jsonObj);
        output.info_data = jsonObj;
        output.result = jsonObj.result;
        this._logger.log("jsonObj.result:", jsonObj.result);
        output.respCode = jsonObj.respCode;
        output.respCodeMsg = jsonObj.respCodeMsg;
        output.txNo = jsonObj.txNo; //從409api取得案件編號，//408 request需用到
        this._logger.log("api return output:", this._formateService.transClone(output));
        output.status = true;

        //409如果respCode不是4001，雖然成功，但要導失敗 , result == '1'(失敗)
        if (jsonObj.respCode != '4001' || jsonObj.result != '0') {
          output.excError = false; //其他例外錯誤
          return Promise.resolve(output);
        } else {
          output.excError = true; //無其他例外錯誤
          return Promise.resolve(output);
        }
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

  /**
   * (安控參數) 簽章值處理
   * @param set_data 參數設定
   */
  checkSecurity(set_data: any, returnFlag?: boolean) {
    /**
     * 參數處理
     */
    // this._logger.step('Loan', "checkSecurity init:", this._formateService.transClone(set_data));
    let df_data = {
      custId: '',
      crdate: '',
      ebkcaseno: '',
      txkind: '',
      branchId: '',
      branchName: '',
      giveAmt: '',
      giveDurYymm: '',
      loanUsage: '',
      refundWay: '',
      graveYymm: '',
      repName: '',
      repName_long: '',
      sex: '',
      applyBir: '',
      levelOfEducation: '',
      maritalStatus: '',
      supportChildren: '',
      applyTelSun: '',
      applyTelNight: '',
      applyTelWalk: '',
      applyTelFax: '',
      eMail: '',
      houseStatus: '',
      homeownership2: '',
      houseDurYymm: '',
      applyHouseAddr: '',
      applyAddr: '',
      applyLiveAddr: '',
      applyServeUnit: '',
      applyBussitem: '',
      applyWorker: '',
      applyTelFirm: '',
      applyTelExt: '',
      applyDept: '',
      applyTrade: '',
      metier: '',
      metier_sub: '',
      applyFirmAddr: '',
      applyPost: '',
      applyServeYymm: '',
      applyServeMm: '',
      serverdur: '',
      serverdurMm: '',
      mYear: '',
      applyNt: '',
      spouseNt: '',
      totalNt: '',
      expense: '',
      frmPaylist: '',
      account: '',
      accountbrid: '',
      accountbrcn: '',
      accountcd: '',
      acctno: '',
      rate: '',
      kycyn: '',
      kycloanUsage: '',
      kycold: '',
      kycetch: '',
      kycetchno: '',
      kycbankel: '',
      kyccard: '',
      kycpaymo: '',
      kycelamt: '',
      kycelmo: '',
      kycko: '',
      agree: '',
      agreeJc: '',
      agreeJcVer: '',
      agreeCt: '',
      agreeCtVer: '',
      agreeTr: '',
      agreeTrVer: '',
      agreeCm: '',
      agreeCmVer: '',
      agreeCp: '',
      companyId: '',
      relationKind1: '',
      relationKind2: '',
      relationKind3: '',
      trnsToken: ''
    };
    const custId = this.authService.getCustId();
    if (custId == '') {
      return false;
    }
    df_data.crdate = this._formateService.checkField(set_data, 'crdate');
    df_data.ebkcaseno = this._formateService.checkField(set_data, 'ebkcaseno');
    df_data.txkind = this._formateService.checkField(set_data, 'txkind');
    df_data.branchId = this._formateService.checkField(set_data, 'branchId');
    df_data.branchName = this._formateService.checkField(set_data, 'branchName');
    df_data.giveAmt = this._formateService.checkField(set_data, 'giveAmt');
    df_data.giveDurYymm = this._formateService.checkField(set_data, 'giveDurYymm');
    df_data.loanUsage = this._formateService.checkField(set_data, 'loanUsage');
    df_data.refundWay = this._formateService.checkField(set_data, 'refundWay');
    df_data.graveYymm = this._formateService.checkField(set_data, 'graveYymm');
    df_data.repName = this._formateService.checkField(set_data, 'repName');
    df_data.repName_long = this._formateService.checkField(set_data, 'repName_long');
    df_data.sex = this._formateService.checkField(set_data, 'sex');
    df_data.applyBir = this._formateService.checkField(set_data, 'applyBir');
    df_data.levelOfEducation = this._formateService.checkField(set_data, 'levelOfEducation');
    df_data.maritalStatus = this._formateService.checkField(set_data, 'maritalStatus');
    df_data.supportChildren = this._formateService.checkField(set_data, 'supportChildren');
    df_data.applyTelSun = this._formateService.checkField(set_data, 'applyTelSun');
    df_data.applyTelNight = this._formateService.checkField(set_data, 'applyTelNight');
    df_data.applyTelWalk = this._formateService.checkField(set_data, 'applyTelWalk');
    df_data.applyTelFax = this._formateService.checkField(set_data, 'applyTelFax');
    df_data.eMail = this._formateService.checkField(set_data, 'eMail');
    df_data.houseStatus = this._formateService.checkField(set_data, 'houseStatus');
    df_data.homeownership2 = this._formateService.checkField(set_data, 'homeownership2');
    df_data.houseDurYymm = this._formateService.checkField(set_data, 'houseDurYymm');
    df_data.applyHouseAddr = this._formateService.checkField(set_data, 'applyHouseAddr');
    df_data.applyAddr = this._formateService.checkField(set_data, 'applyAddr');
    df_data.applyLiveAddr = this._formateService.checkField(set_data, 'applyLiveAddr');
    df_data.applyServeUnit = this._formateService.checkField(set_data, 'applyServeUnit');
    df_data.applyBussitem = this._formateService.checkField(set_data, 'applyBussitem');
    df_data.applyWorker = this._formateService.checkField(set_data, 'applyWorker');
    df_data.applyTelFirm = this._formateService.checkField(set_data, 'applyTelFirm');
    df_data.applyTelExt = this._formateService.checkField(set_data, 'applyTelExt');
    df_data.applyDept = this._formateService.checkField(set_data, 'applyDept');
    df_data.applyTrade = this._formateService.checkField(set_data, 'applyTrade');
    df_data.metier = this._formateService.checkField(set_data, 'metier');
    df_data.metier_sub = this._formateService.checkField(set_data, 'metier_sub');
    df_data.applyFirmAddr = this._formateService.checkField(set_data, 'applyFirmAddr');
    df_data.applyPost = this._formateService.checkField(set_data, 'applyPost');
    df_data.applyServeYymm = this._formateService.checkField(set_data, 'applyServeYymm');
    df_data.applyServeMm = this._formateService.checkField(set_data, 'applyServeMm');
    df_data.serverdur = this._formateService.checkField(set_data, 'serverdur');
    df_data.serverdurMm = this._formateService.checkField(set_data, 'serverdurMm');
    df_data.mYear = this._formateService.checkField(set_data, 'mYear');
    df_data.applyNt = this._formateService.checkField(set_data, 'applyNt');
    df_data.spouseNt = this._formateService.checkField(set_data, 'spouseNt');
    df_data.totalNt = this._formateService.checkField(set_data, 'totalNt');
    df_data.expense = this._formateService.checkField(set_data, 'expense');
    df_data.frmPaylist = this._formateService.checkField(set_data, 'frmPaylist');
    df_data.account = this._formateService.checkField(set_data, 'account');
    df_data.accountbrid = this._formateService.checkField(set_data, 'accountbrid');
    df_data.accountbrcn = this._formateService.checkField(set_data, 'accountbrcn');
    df_data.accountcd = this._formateService.checkField(set_data, 'accountcd');
    df_data.acctno = this._formateService.checkField(set_data, 'acctno');
    df_data.rate = this._formateService.checkField(set_data, 'rate');
    df_data.kycyn = this._formateService.checkField(set_data, 'kycyn');
    df_data.kycloanUsage = this._formateService.checkField(set_data, 'kycloanUsage');
    df_data.kycold = this._formateService.checkField(set_data, 'kycold');
    df_data.kycetch = this._formateService.checkField(set_data, 'kycetch');
    df_data.kycetchno = this._formateService.checkField(set_data, 'kycetchno');
    df_data.kycbankel = this._formateService.checkField(set_data, 'kycbankel');
    df_data.kyccard = this._formateService.checkField(set_data, 'kyccard');
    df_data.kycpaymo = this._formateService.checkField(set_data, 'kycpaymo');
    df_data.kycelamt = this._formateService.checkField(set_data, 'kycelamt');
    df_data.kycelmo = this._formateService.checkField(set_data, 'kycelmo');
    df_data.kycko = this._formateService.checkField(set_data, 'kycko');
    df_data.agree = this._formateService.checkField(set_data, 'agree');
    df_data.agreeJc = this._formateService.checkField(set_data, 'agreeJc');
    df_data.agreeJcVer = this._formateService.checkField(set_data, 'agreeJcVer');
    df_data.agreeCt = this._formateService.checkField(set_data, 'agreeCt');
    df_data.agreeCtVer = this._formateService.checkField(set_data, 'agreeCtVer');
    df_data.agreeTr = this._formateService.checkField(set_data, 'agreeTr');
    df_data.agreeTrVer = this._formateService.checkField(set_data, 'agreeTrVer');
    df_data.agreeCm = this._formateService.checkField(set_data, 'agreeCm');
    df_data.agreeCmVer = this._formateService.checkField(set_data, 'agreeCmVer');
    df_data.agreeCp = this._formateService.checkField(set_data, 'agreeCp');
    df_data.companyId = this._formateService.checkField(set_data, 'companyId');
    df_data.relationKind1 = this._formateService.checkField(set_data, 'relationKind1');
    df_data.relationKind2 = this._formateService.checkField(set_data, 'relationKind2');
    df_data.relationKind3 = this._formateService.checkField(set_data, 'relationKind3');
    df_data.trnsToken = this._formateService.checkField(set_data, 'trnsToken');
    df_data.custId = custId; // user info;
    this._logger.log("1. df_data:", this._formateService.transClone(df_data));
    let now_data = this._formateService.transClone(df_data);
    this._logger.log("2. now_data:", this._formateService.transClone(now_data));
    //req formate處理，ex:金額*10000
    let result_data = this._allService.formateReqData(now_data);
    this._logger.log("3. result_data:", this._formateService.transClone(result_data));

    // REQ data 前處理
    this._logger.step('Loan', "2. checkSecurity output", this._formateService.transClone(df_data));

    // 回傳資料進行安控處理 (憑證)
    if (returnFlag) {
      this._logger.log("returnFlag true, result_data:", this._formateService.transClone(result_data));
      return result_data;
    } else {
      this._logger.log("returnFlag false");
      return {
        signText: result_data,
        serviceId: 'F9000409',
        securityType: '',
        transAccountType: '1',
        otpObj: {
          custId: custId,
          fnctId: 'F9000409',
          depositNumber: set_data.account, // 轉出帳號
          depositMoney: result_data.giveAmt, // 金額 *10000
          OutCurr: 'TWD', // 幣別 
          transTypeDesc: '' // 
        }
      };
    }
  }





}




