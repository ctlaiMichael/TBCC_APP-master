import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CommonAccountService } from '@pages/user-set/shared/service/commonAccount.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { PredesignatedTransferService } from '../shared/predesignated.service';
import { TwdTransferService } from '@pages/transfer/shared/service/twdTransfer.service';
import { F4000102ApiService } from '@api/f4/f4000102/f4000102-api.service';
import { LoanService } from '@pages/a11y/loan/shared/loan.service';
import { ChineseCheckUtil } from '@shared/util/check/word/chinese-check-util';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-predesignated-transfer-page',
  templateUrl: './predesignated-transfer-page.component.html',
  providers: [CommonAccountService, PredesignatedTransferService, TwdTransferService, F4000102ApiService]
})
export class PredesignatedTransferPageComponent implements OnInit {
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
    title: '約定轉帳',
    backPath: 'a11yhomekey',
  };

  balanceAmt = ''; // 餘額金額

  transferObj = {
    trnsOutAccts: [
      {
        acctNo: '',
        balance: ''
      }
    ],           // 轉出帳號清單，array of object
    selectTrnsOutAcct: -1,      // 選擇之轉出帳號
    balanceShow: false,         // 顯示餘額
    trnsInAccts: [],            // 轉入帳號清單
    selectTrnsInAcct: -1,       // 選擇之轉入帳號
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

  checkObj = {
    checkTransOut: true,               // 選擇轉出帳號檢核
    checkTransIn: true,                // 選擇轉入帳號檢核
    checkTransAmt: true,               // 轉帳金額檢核
    checkNotePayer: true,              // 付款人備註
    checkNotePayee: true,              // 給收款人訊息

    TransOutStr: '請選擇轉出帳號',
    TransInStr: '請選擇約定轉入帳號',
    TransAmtStr: '請輸入轉帳金額',
    NotePayerStr: '',
    NotePayeeStr: ''
  }

  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private predesignatedTransferService: PredesignatedTransferService,
    private twdTransferService: TwdTransferService,
    private loanService: LoanService,
    private _logger: Logger
  ) { }


  ngOnInit() {
    this.headerCtrl.setOption(this.headerObj);
    this.headerCtrl.setLeftBtnClick(() => {
      this.cancel();
    });
    if (Object.keys(this.navgator.getParams()).length > 0) { // 從上一頁回來的話直接取得transferObj
      this.transferObj = this.navgator.getParams();
      this.transOutChange(); // 餘額變數不在 transferObj，需重設
      // 依照銀行代碼由小至大進行排序
      this.sortTrnsInAccts();
    } else {
      this.twdTransferService.getData().then( // 取得約定轉帳帳號及餘額
        (resObj) => {
          this.transferObj.trnsOutAccts = resObj.account.trnsOutAccts;
          this.transferObj.trnsInAccts = resObj.account.trnsInAccts;
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
          // 依照銀行代碼由小至大進行排序
          this.sortTrnsInAccts();
        },
        (errObj) => { // 發送電文service錯誤時有alert，此處不用再alert
          this.navgator.push('a11yhomekey');
        }
      );
    }
  }


  nextStep() { // 下一步
    this.checkTransfer();
    if (!this.checkObj.checkTransOut || !this.checkObj.checkTransIn || !this.checkObj.checkTransAmt ||
      !this.checkObj.checkNotePayer || !this.checkObj.checkNotePayee) {
      return;
    }
    this.navgator.push('a11ypredesignatedconfirmkey', this.transferObj);
  }

  cancel() { // 取消
    this.predesignatedTransferService.cancel();
  }

  checkTransfer() { // 檢核欄位
    this.checkObj.checkTransOut = this.transferObj.selectTrnsOutAcct >= 0 ? true : false;
    this.checkObj.checkTransIn = this.transferObj.selectTrnsInAcct >= 0 ? true : false;
    this.checkObj.checkTransAmt = Number(this.transferObj.trnsfrAmount) > 0 ? true : false;


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

  transOutChange() { // 選擇、更改轉出帳號
    this.transferObj.balanceShow = this.transferObj.selectTrnsOutAcct >= 0 ? true : false; // 有選轉出帳號就秀餘額
    this.checkObj.checkTransOut = this.transferObj.balanceShow;
    // 根據所選之轉出帳號，更改顯示之餘額金額
    this.balanceAmt = this.transferObj.trnsOutAccts[this.transferObj.selectTrnsOutAcct].balance;
  }

  transInChange() {
    this.checkObj.checkTransIn = this.transferObj.selectTrnsInAcct >= 0 ? true : false; // 選擇轉入帳號時檢核此欄位
    setTimeout(() => {
      this.trnsInSelect.nativeElement.focus();
    }, 1000);
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
    return this.predesignatedTransferService.accountNoFormateOnlyDash(account);
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
  sortTrnsInAccts() {
    if (this.transferObj && this.transferObj.trnsInAccts.length !== 0) {
      this.transferObj.trnsInAccts.sort((a, b) => +a.bankId - +b.bankId);
    }
  }
}
