import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CommonAccountService } from '@pages/user-set/shared/service/commonAccount.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { NoPredesignatedTransferService } from '../shared/no-predesignated.service';
import { TwdTransferService } from '@pages/transfer/shared/service/twdTransfer.service';
import { SearchBankService } from '@shared/template/bank/search-bank.srevice';
import { F4000103ApiService } from '@api/f4/f4000103/f4000103-api.service';
import { LoanService } from '@pages/a11y/loan/shared/loan.service';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';
import { Logger } from '@core/system/logger/logger.service';
import { CheckService } from '@shared/check/check.service';
import { AuthService } from '@core/auth/auth.service';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { FormateService } from '@shared/formate/formate.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
@Component({
  selector: 'app-no-predesignated-transfer-page',
  templateUrl: './no-predesignated-transfer-page.component.html',
  providers: [CommonAccountService, NoPredesignatedTransferService,SearchBankService,F4000103ApiService]
})
export class NoPredesignatedTransferPageComponent implements OnInit {
  @ViewChild('trnsInSelect') private trnsInSelect: ElementRef;
  check_type = { // 檢核用
    'english': true, // 允許英文
    'symbol': false, // 不允許符號
    'number': true   // 允許數值
  }
  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',
    rightBtnIcon: 'noshow',
    title: '非約定轉帳',
    backPath: 'a11yhomekey',
  };
  
  // 頁面控制變數 
  transferPage = 'init';
  nextflag = true;
  balanceAmt = ''; // 餘額金額
  transferObj = {
    otpObj:{},
    trnsOutAccts: [
      {
        acctNo: '',
        balance: ''
      }
    ],           // 轉出帳號清單，array of object
    trnsfrOTP:'',
    selectTrnsOutAcct: -1,      // 選擇之轉出帳號
    balanceShow: false,         // 顯示餘額
    selectbankcode: -1,         // 選擇轉入帳號銀行代碼
    selectbankFullName: '',     // 轉入全帳號顯示名稱
    inputTrnsInAcct: '',       // 選擇之轉入帳號]
    trnsfrAmount: '',           // 轉帳金額
    trnsfrMech: '',             // 轉帳機制
    notePayer: '',              // 付款人備註
    notePayee: '',              // 給收款人訊息
    SSLpwd: '',                 // SSL轉帳密碼
    transferResult: '',         // 轉帳結果
    transfer_errObj: {},        // 轉帳結果_錯誤訊息
    trnsfrFee: '',              // 轉帳手續費
    businessType: '',           // 次營業日註記
    trnsToken: ''               // 交易控制碼
  }
  
  defaultAcount=false;
  checkObj = {
    checkTransOut: true,               // 選擇轉出帳號檢核
    checkTransIn: true,                // 選擇轉入帳號檢核
    checkTransInBankCode: true,        // 選擇轉入帳號銀行代碼
    checkTransAmt: true,               // 轉帳金額檢核
    checkNotePayer: true,              // 付款人備註
    checkNotePayee: true,              // 給收款人訊息
    checkTransOTP:true,
    TransOutStr: '請選擇轉出帳號',
    TransInStr: '請輸入非約定轉入帳號',
    TransAmtStr: '請輸入轉帳金額',
    TransOTPStr: '請輸入OTP驗證碼轉',
    TransInBankStr : '請選擇轉入帳號銀行代碼',
    NotePayerStr: '',
    NotePayeeStr: ''
  }

  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private noPredesignatedTransferService: NoPredesignatedTransferService,
    private twdTransferService: TwdTransferService,
    private searchBankService: SearchBankService,
    private loanService: LoanService,
    private _logger: Logger,
    private checkService: CheckService,
    private _authService: AuthService,
    private alert: A11yAlertService,
    private _formateService: FormateService,
    private _handleError: HandleErrorService,
    
    
  ) { }


  ngOnInit() {
    this.headerCtrl.setOption(this.headerObj);
    this.headerCtrl.setLeftBtnClick(() => {
      this.cancel();
    });

    // 判斷非約轉註記
    if(this._authService.getUserInfo().isNAAcct=='0'){
          
      this.alert.show(  '您尚未開放非約定轉帳機制' , {
        title: 'POPUP.NOTICE.TITLE'
      }).then(()=>{
        this.navgator.push('a11yhomekey');
      });
      this.nextflag = false;
      
      return ;
    }
    // 判斷ＯＴＰ
    console.log(Object.keys(this.navgator.getParams()).length)
  // OTP 判斷
    if (!this._authService.checkSecurityOtp()) {
      this.nextflag = false;
      return ;
    }


    if (Object.keys(this.navgator.getParams()).length > 0) { // 從上一頁回來的話直接取得transferObj
      
      this.transferObj = this.navgator.getParams();
      this.transOutChange(); // 餘額變數不在 transferObj，需重設
      // 依照銀行代碼由小至大進行排序
      // this.sortTrnsInAccts();
    } else {
     
      this.twdTransferService.getData().then( // 取得約定轉帳帳號及餘額
        (resObj) => {
          this.transferObj.trnsOutAccts = resObj.account.trnsOutAccts;
          
          // this.transferObj.trnsInAccts = resObj.account.trnsInAccts;
          this.transferObj.businessType = resObj.account.info_data.businessType;
          this.transferObj.trnsToken = resObj.account.info_data.trnsToken;
          this.transferObj.trnsOutAccts.forEach((trnsOutAcct) => {
            resObj.balance.data.some(function (element) {
              if (trnsOutAcct.acctNo === element.acctNo) {
                trnsOutAcct.balance = element.balance;
                return true;
              }
            });
          });
          if(resObj.account.trnsOutAccts.length == 1){ 
            this.defaultAcount = true;
            console.log(resObj.account.trnsOutAccts[0].acctNo);
            this.transferObj.selectTrnsOutAcct =  0;
            this.transOutChange();
          }
           // 非約轉註記判斷
           if(resObj.account.info_data.allowNonAgreeAcctFlag=='N'){
          
            this.alert.show(  '您尚未開放非約定轉帳機制' , {
              title: 'POPUP.NOTICE.TITLE'
            }).then(()=>{
              this.navgator.push('a11yhomekey');
            });  
            return ;
          }

        
         

          // 依照銀行代碼由小至大進行排序
          // this.sortTrnsInAccts();
        },
        (errObj) => { // 發送電文service錯誤時有alert，此處不用再alert
          errObj['type']='message';
          this._handleError.handleError(errObj);
          // this.navgator.push('a11yhomekey');
          return ;
        }
      ); 
    }
    if(this.nextflag){
      this.searchBankService.getBank().then(
        (getBankCode_S)=>{
          console.log('bankS',getBankCode_S);
          this.transferObj['bankcode']=getBankCode_S.data;
          
          // 
        },(getBankCode_F)=>{
          getBankCode_F['type']='message';
          this._handleError.handleError(getBankCode_F);
          console.log('bankF',getBankCode_F);
        }
      );
    }
  }

  nextStep() { // 下一步
    this.checkTransfer();

      
    if (!this.checkObj.checkTransOut || !this.checkObj.checkTransInBankCode || !this.checkObj.checkTransIn || !this.checkObj.checkTransAmt ||
      !this.checkObj.checkNotePayer || !this.checkObj.checkNotePayee) {
        console.log(this.checkObj);
      return;
    }
    this.headerCtrl.setLeftBtnClick(() => {
      this.transferPage = 'init';
      this.cancel();
    });
    this.transferPage = 'confirm';
  
    // this.navgator.push('a11ypredesignatedconfirmkey', this.transferObj);
  }

  cancel() { // 取消
    this.noPredesignatedTransferService.cancel();
  }

  checkTransfer() { // 檢核欄位
    console.log(this.transferObj.selectTrnsOutAcct);
    this.checkObj.checkTransOut = this.transferObj.selectTrnsOutAcct >= 0 ? true : false;
    console.log(this.transferObj.inputTrnsInAcct);

    this.transInChange();
    this.checkObj.checkTransInBankCode = this.transferObj['selectbankcode'] >= 0 ? true : false;


    this.checkObj.checkTransAmt = true;
    if(Number(this.transferObj.trnsfrAmount) <= 0){ 
      this.checkObj.TransAmtStr = '請輸入轉帳金額';
      this.checkObj.checkTransAmt = false;
    }
    let checkmonydata = this.checkService.checkNumber(this.transferObj.trnsfrAmount);
    if(!checkmonydata || !checkmonydata.status){ 
      this.checkObj.TransAmtStr = '轉帳金額請輸入數值';
      this.checkObj.checkTransAmt = false;
    }
    if (parseInt(this.transferObj.trnsfrAmount) > 50000) {
      this.checkObj.TransAmtStr = '非約定單筆已超過限額';
      this.checkObj.checkTransAmt = false;
    }

    const tooLong: string = "請勿輸入超過18位英數字或8個中文字";

    let notePayerCheck = ChineseCheckUtil.checkChinese(this.transferObj.notePayer, this.check_type); // 只允許中英文
    this.checkObj.checkNotePayer = notePayerCheck.status;
    this.checkObj.NotePayerStr = notePayerCheck.msg;
    if (this.checkObj.checkNotePayer) { // 檢核無特殊符號且為中英文再檢核長度
      if (this.getStringLength(this.transferObj.notePayer) > 18) {
        this.checkObj.checkNotePayer = false;
        this.checkObj.NotePayerStr = tooLong;
      }
    }

    let notePayeeCheck = ChineseCheckUtil.checkChinese(this.transferObj.notePayee, this.check_type); // 只允許中英文
    this.checkObj.checkNotePayee = notePayeeCheck.status;
    this.checkObj.NotePayeeStr = notePayeeCheck.msg;
    if (this.checkObj.checkNotePayee) { // 檢核無特殊符號且為中英文再檢核長度
      if (this.getStringLength(this.transferObj.notePayee) > 18) {
        this.checkObj.checkNotePayee = false;
        this.checkObj.NotePayeeStr = tooLong;
      }
    }
  }
  bankcodeChange(bankElement) {
   
    let selectedIndex = bankElement.target.selectedIndex;
    if(bankElement.target.options.length!=this.transferObj['bankcode'].length){
      selectedIndex = bankElement.target.selectedIndex-1;
    }
    let bankObj=this.transferObj['bankcode'][selectedIndex];
    this.transferObj.selectbankFullName = bankObj.bankCode+"-"+ bankObj.bankName;
  
  }
  transOutChange() { // 選擇、更改轉出帳號
    console.log(this.transferObj.selectTrnsOutAcct);
    this.transferObj.balanceShow = this.transferObj.selectTrnsOutAcct >= 0 ? true : false; // 有選轉出帳號就秀餘額
    this.checkObj.checkTransOut = this.transferObj.balanceShow;
    // 根據所選之轉出帳號，更改顯示之餘額金額
    this.balanceAmt = this.transferObj.trnsOutAccts[this.transferObj.selectTrnsOutAcct].balance;
  }

  transInChange() {
    this.checkObj.checkTransIn = true;
    if(this.transferObj.inputTrnsInAcct!=''){
      // 檢核為純數值

      let checkdata = this.checkService.checkNumber(this.transferObj.inputTrnsInAcct);
      if(!checkdata || !checkdata.status){ 
        this.checkObj.TransInStr = '非約定帳號請輸入數值';
        this.checkObj.checkTransIn = false;
      }
    }else{
      this.checkObj.TransInStr = '請輸入非約定轉入帳號';
      this.checkObj.checkTransIn = false;
    }
  }

  transAmtChange() {
    this.checkObj.checkTransAmt = Number(this.transferObj.trnsfrAmount) > 0 ? true : false; // 輸入金額時檢核此欄位
  }



  notePayerChange() {
    const tooLong: string = "請勿輸入超過18位英數字或8個中文字";

    let notePayerCheck = ChineseCheckUtil.checkChinese(this.transferObj.notePayer, this.check_type); // 只允許中英文
    this.checkObj.checkNotePayer = notePayerCheck.status;
    this.checkObj.NotePayerStr = notePayerCheck.msg;
    if (this.checkObj.checkNotePayer) { // 檢核無特殊符號且為中英文再檢核長度
      if (this.getStringLength(this.transferObj.notePayer) > 18) {
        this.checkObj.checkNotePayer = false;
        this.checkObj.NotePayerStr = tooLong;
      }
    }
  }

  notePayeeChange() {
    const tooLong: string = "請勿輸入超過18位英數字或8個中文字";

    let notePayeeCheck = ChineseCheckUtil.checkChinese(this.transferObj.notePayee, this.check_type); // 只允許中英文
    this.checkObj.checkNotePayee = notePayeeCheck.status;
    this.checkObj.NotePayeeStr = notePayeeCheck.msg;
    if (this.checkObj.checkNotePayee) { // 檢核無特殊符號且為中英文再檢核長度
      if (this.getStringLength(this.transferObj.notePayee) > 18) {
        this.checkObj.checkNotePayee = false;
        this.checkObj.NotePayeeStr = tooLong;
      }
    }
  }

  formatAccount(account: string) {
    return AccountMaskUtil.accountNoFormate(account);
  }

  formateTrnsInAcct(account: string) {
    return this.noPredesignatedTransferService.accountNoFormateOnlyDash(account);
  }

  twdTitle(amount: string, prefix?: string) {
    if (amount.length == 0) {
      return '';
    }
    return this.loanService.twdTitle(amount, prefix);
  }

  // 取得中英文混合字串長度
  getStringLength(str: string) {
    return str.replace(/[^\x00-\xff]/g, "**").length;
  }

  // 轉帳金額只能輸入0-9
  checkNumber(event) {
    event = event.replace(/\D/g, '');
    this._logger.debug(typeof event);
    this._logger.debug(JSON.stringify(event));
    this.transferObj.trnsfrAmount = event;
  }

  /**
   * 依照銀行代碼由小至大進行排序約定轉入帳號
   */
  // sortTrnsInAccts() {
  //   if (this.transferObj && this.transferObj.trnsInAccts.length !== 0) {
  //     this.transferObj.trnsInAccts.sort((a, b) => +a.bankId - +b.bankId);
  //   }
  // }


  toResultPage(e){
    if(e && e.hasOwnProperty('transferPage')){
      console.log(e);
      
      if(e.transferPage=='OTP'){
        // // 到ＯＴＰ
        this.transferObj.otpObj['fnctId']= 'f4000102'; 
        this.transferObj.otpObj['depositNumber']= this.transferObj.inputTrnsInAcct
        this.transferObj.otpObj['depositMoney']= this.transferObj.trnsfrAmount;
        this.transferObj.otpObj['OutCurr']= 'TWD';
        this.transferObj.otpObj['transTypeDesc'] = '';
        this.transferPage = 'OTP';
      }else if(e.transferPage=='confirm'){
        
      }else if(e.transferPage=='result'){
        // 發結果電文
        // 
        let sendData={
            trnsfrOutAccnt : this._formateService.checkField(this.transferObj.trnsOutAccts[this.transferObj.selectTrnsOutAcct], 'acctNo'),
            trnsfrInBank : this._formateService.checkField(this.transferObj, 'selectbankcode'),
            trnsfrInAccnt : this._formateService.checkField(this.transferObj, 'inputTrnsInAcct'),
            trnsInSetType : '3',
            trnsfrAmount : this._formateService.checkField(this.transferObj, 'trnsfrAmount'),
            notePayer  : this._formateService.checkField(this.transferObj, 'notePayer'),
            notePayee : this._formateService.checkField(this.transferObj, 'notePayee'),
            businessType : this._formateService.checkField(this.transferObj, 'businessType'),
            trnsToken : this._formateService.checkField(this.transferObj, 'trnsToken')
          };
          console.log(e);
          console.log(e.securityResult);
          let security={securityResult:e['securityResult']};

          console.log(sendData,security);
          
          this.twdTransferService.sendCurrent(sendData, security).then( // 約定轉帳 - 發送轉帳電文
            (resobj) => {
              this.transferObj.trnsfrFee = resobj.info_data.trnsfrFee;
              this.transferObj.transferResult = 'success'; // 給result頁面使用

              // 測試fail用
              // this.transferObj.transferResult = 'fail'; // 給result頁面使用
              // this.transferObj.transfer_errObj = { a: 'b', c: 'd' }; //

              // this.navgator.push('a11ypredesignatedresultkey', this.transferObj);
              this.transferPage=e.transferPage;
            },
            (errobj) => {
              this.transferObj.transferResult = 'fail'; // 給result頁面使用
              this.transferObj.transfer_errObj = errobj;
              errobj['type']='message';
              this._handleError.handleError(errobj);
              // this.navgator.push('a11ypredesignatedresultkey', this.transferObj);
            }
          );
          // this.navgator.push('a11ypredesignatedresultkey', this.transferObj);       
        return ;

      }else if(e.transferPage=='init'){
        this.headerCtrl.setLeftBtnClick(() => {
          this.cancel();
        });
        this.headerCtrl.setBakBtnfocus(true);
      }
      this.transferPage=e.transferPage;
    }
    
  }
}
