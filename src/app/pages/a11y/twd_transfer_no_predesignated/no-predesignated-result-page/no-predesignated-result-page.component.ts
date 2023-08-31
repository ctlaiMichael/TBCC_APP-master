import { Component, OnInit ,Input, Output, EventEmitter} from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { NoPredesignatedTransferService } from '../shared/no-predesignated.service';
import { LoanService } from '@pages/a11y/loan/shared/loan.service';

// @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();  // 確認頁即將送往電文
@Component({
  selector: 'no-app-predesignated-result-page',
  templateUrl: './no-predesignated-result-page.component.html',
  providers: [NoPredesignatedTransferService]
})
export class NoPredesignatedResultPageComponent implements OnInit {
  @Input() transferObj;
  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'home',
    rightBtnIcon: 'noshow',
    title: '非約定轉帳',
    backPath: 'a11yhomekey',
  };
  show_errObj: boolean; // 當轉帳錯誤且errObj length > 0 為 true
  errObj_keys: string[]; // 儲存 errObj 的 keys，給 html 跑 ngFor

  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private authService: AuthService,
    public formateService: FormateService,
    private noPredesignatedTransferService: NoPredesignatedTransferService,
    private loanService: LoanService) { }

  ngOnInit() {
    this.headerCtrl.setOption(this.headerObj);
    // this.headerCtrl.setBakBtnfocus(true);
    this.headerCtrl.setLeftBtnClick(() => this.navgator.push('a11yhomekey'));
    // if (Object.keys(this.navgator.getParams()).length > 0) {
    //   this.transferObj = this.navgator.getParams(); // 取得傳遞之 transferObj
    //   this.show_errObj = this.transferObj.hasOwnProperty('transfer_errObj') ? true : false;
    //   if (this.show_errObj) {
    //     this.errObj_keys = Object.keys(this.transferObj.transfer_errObj);
    //   }
    // } else {
    //   this.navgator.push('a11yhomekey');
    // }
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

}
