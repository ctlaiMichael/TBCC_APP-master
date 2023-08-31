import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { F4000102ApiService } from '@api/f4/f4000102/f4000102-api.service';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';
import { F4000102ReqBody } from '@api/f4/f4000102/f4000102-req';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { PredesignatedTransferService } from '../shared/predesignated.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { CaService } from '@shared/transaction-security/ca-popup/ca.service';
import { OtpService } from '@shared/transaction-security/otp-popup/otp.service';
import { TwdTransferService } from '@pages/transfer/shared/service/twdTransfer.service';

@Component({
  selector: 'app-predesignated-confirm-page',
  templateUrl: './predesignated-confirm-page.component.html',
  providers: [F4000102ApiService, PredesignatedTransferService, CheckSecurityService, CaService, OtpService, TwdTransferService]
})
export class PredesignatedConfirmPageComponent implements OnInit {

  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',
    rightBtnIcon: 'noshow',
    title: '約定轉帳',
    backPath: 'a11ypredesignatedtransferkey'
  };

  transferObj: any;
  transferTitle: string; // 轉帳金額報讀

  checkSSL: boolean; // SSL密碼檢核
  SSLStr = 'SSL轉帳密碼必須為8-16位英數字，請重新輸入';

  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private authService: AuthService,
    private f4000102: F4000102ApiService,
    private a11yAlertService: A11yAlertService,
    private a11yConfirmService: A11yConfirmService,
    public formateService: FormateService, //
    private checkService: CheckService,
    private predesignatedTransferService: PredesignatedTransferService,
    private checkSecurityService: CheckSecurityService,
    private twdTransferService: TwdTransferService) { }

  ngOnInit() {
    this.checkSSL = true; // 初始時不顯示SSL密碼檢核錯誤
    this.headerCtrl.setOption(this.headerObj);
    if (Object.keys(this.navgator.getParams()).length > 0) {
      this.transferObj = this.navgator.getParams();
    } else {
      this.navgator.push('a11yhomekey');
    }
    this.transferTitle = this.predesignatedTransferService.twdTitle(this.transferObj.trnsfrAmount, '轉帳金額');
    this.headerCtrl.setLeftBtnClick(() => {
      this.back();
    });

  }

  confirm() { // 確認

    this.SSLchange(); // SSL 密碼檢核
    if (!this.checkSSL) {
      return;
    }

    let reqObj = {
      custId: '', // 到Service再塞值
      trnsfrOutAccnt: this.transferObj.trnsOutAccts[this.transferObj.selectTrnsOutAcct].acctNo,
      trnsfrInBank: this.transferObj.trnsInAccts[this.transferObj.selectTrnsInAcct].bankId,
      trnsfrInAccnt: this.transferObj.trnsInAccts[this.transferObj.selectTrnsInAcct].acctNo,
      trnsfrAmount: String(this.transferObj.trnsfrAmount),
      notePayer: this.transferObj.notePayer,
      notePayee: this.transferObj.notePayee,
      businessType: this.transferObj.businessType,
      trnsToken: this.transferObj.trnsToken
    };
    this.transferObj.SSLpwd = this.checkSecurityService.padRight(this.transferObj.SSLpwd, 16); // SSL密碼右邊補空白到16位

    this.authService.digitalEnvelop(this.transferObj.SSLpwd).then( // SSL密碼加密
      (resObj) => {
        this.transferObj.SSLpwd = resObj.value; //
        let security = {
          securityResult: {
            headerObj: {
              SecurityType: '1', // SSL 模式固定帶 1
              SecurityPassword: this.transferObj.SSLpwd
            }
          }
        }
        this.twdTransferService.sendCurrent(reqObj, security).then( // 約定轉帳 - 發送轉帳電文
          (resobj) => {
            this.transferObj.trnsfrFee = resobj.info_data.trnsfrFee;
            this.transferObj.transferResult = 'success'; // 給result頁面使用

            // 測試fail用
            // this.transferObj.transferResult = 'fail'; // 給result頁面使用
            // this.transferObj.transfer_errObj = { a: 'b', c: 'd' }; //

            this.navgator.push('a11ypredesignatedresultkey', this.transferObj);
          },
          (errobj) => {
            this.transferObj.transferResult = 'fail'; // 給result頁面使用
            this.transferObj.transfer_errObj = errobj;
            this.navgator.push('a11ypredesignatedresultkey', this.transferObj);
          }
        );
        this.navgator.push('a11ypredesignatedresultkey', this.transferObj);
      },
      (errObj) => {

      }
    );
  }
  back() {
    this.transferObj.SSLpwd = '';
    this.navgator.push('a11ypredesignatedtransferkey', this.transferObj);
  }
  cancel() {
    this.predesignatedTransferService.cancel();
  }
  SSLchange() { // SSL密碼欄位變更時、送出電文前的檢核
    let check_max = this.checkService.checkLength(this.transferObj.SSLpwd, 16, 'max');
    let check_min = this.checkService.checkLength(this.transferObj.SSLpwd, 8, 'min');
    let check_english_number = this.checkService.checkEnglish(this.transferObj.SSLpwd, 'english_number');
    this.checkSSL = (check_max.status && check_min.status && check_english_number.status) ? true : false;
  }

  formatAccount(account: string) {
    return AccountMaskUtil.accountNoFormate(account);
  }

  formateTrnsInAcct(account: string) {
    return this.predesignatedTransferService.accountNoFormateOnlyDash(account);
  }
}
