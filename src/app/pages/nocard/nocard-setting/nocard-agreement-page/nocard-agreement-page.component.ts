import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NocardAccountService } from '../../shared/service/nocard-account.service';

@Component({
  selector: 'app-nocard-agreement-page',
  templateUrl: './nocard-agreement-page.component.html'
})
export class NocardAgreementPageComponent implements OnInit {

  @Output() goToAdd: EventEmitter<any> = new EventEmitter<any>();    // 前往新增頁面

  /**
	 * 轉帳頁面切換
	 * ('originalPage':無卡提款帳號設定，'agreementPage':無卡提款帳號設定-同意條款頁
   *  'confirmPage':無卡提款帳號設定-確認頁)
	 */
  showPage = 'agreementPage';

  firstTime: boolean = false;        // 是否為第一次申請
  agreed: boolean = false;           // 是否同意條款

  constructor(
    private headerCtrl: HeaderCtrlService,
    private navigator: NavgatorService,
    private alertService: AlertService,
    private nocardaccountService: NocardAccountService
  ) { }

  ngOnInit() {
  }

  // 不同意條款
  notAgree() {
    this.navigator.push('nocard');
  }

  // 瞭解並同意
  agree() {
    if (!this.agreed) {
      this.alertService.show('請閱讀並同意條款後進行下一步');
    } else {
      let output = {};
        output['firstTime'] = true;
      this.goToAdd.emit(output);

    }
  }
}
