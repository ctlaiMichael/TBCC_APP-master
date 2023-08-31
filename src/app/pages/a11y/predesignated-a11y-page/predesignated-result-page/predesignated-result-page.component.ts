import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { FormateService } from '@shared/formate/formate.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { PredesignatedTransferService } from '../shared/predesignated.service';
import { LoanService } from '@pages/a11y/loan/shared/loan.service';
@Component({
  selector: 'app-predesignated-result-page',
  templateUrl: './predesignated-result-page.component.html',
  providers: [PredesignatedTransferService]
})
export class PredesignatedResultPageComponent implements OnInit {
  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'home',
    rightBtnIcon: 'noshow',
    title: '約定轉帳',
    backPath: 'a11yhomekey'
  };

  transferObj: any;
  show_errObj: boolean; // 當轉帳錯誤且errObj length > 0 為 true
  errObj_keys: string[]; // 儲存 errObj 的 keys，給 html 跑 ngFor

  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private authService: AuthService,
    public formateService: FormateService,
    private predesignatedTransferService: PredesignatedTransferService,
    private loanService: LoanService) { }

  ngOnInit() {
    this.headerCtrl.setOption(this.headerObj);
    this.headerCtrl.setLeftBtnClick(() => this.navgator.push('a11yhomekey'));
    if (Object.keys(this.navgator.getParams()).length > 0) {
      this.transferObj = this.navgator.getParams(); // 取得傳遞之 transferObj
      this.show_errObj = this.transferObj.hasOwnProperty('transfer_errObj') ? true : false;
      if (this.show_errObj) {
        this.errObj_keys = Object.keys(this.transferObj.transfer_errObj);
      }
    } else {
      this.navgator.push('a11yhomekey');
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

}
