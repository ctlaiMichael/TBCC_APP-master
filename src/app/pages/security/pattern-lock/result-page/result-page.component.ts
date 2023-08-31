import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';

@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html'
})
export class ResultPageComponent implements OnInit, OnDestroy {
  @Input() resultObj: any;
  className: string = '';
  constructor(
    private navigator: NavgatorService,
    private auth: AuthService,
    private session: SessionStorageService
  ) { }

  ngOnInit() {
    this.setStyle(this.resultObj.trnsRsltCode);
  }

  ngOnDestroy() {
    this.auth.redirectUrl = null;
  }

  clickBtn() {
    if (!!this.resultObj.redirectUrl && !!this.resultObj.redirectPath) {
      this.navigator.push(this.resultObj.redirectPath);
    } else if (this.resultObj.fromLogin) { // 在登入時點選設定圖形密碼
      let login_method = this.session.getObj('login_method');
      if (login_method != '2') {
        this.navigator.push('user-home');
      } else {
        this.navigator.push('epay-card');
      }
    } else { // 登入後點選圖形密碼
      this.navigator.push('security_ftlogin_set');
    }
  }

  setStyle(type) {
    if (type === '0') { // 成功
      this.className = '';
    } else if (type === '1') { // 失敗
      this.className = 'fault_active';
    } else { // 2-處理中 X-異常
      this.className = 'exclamation_active';
    }
  }
}
