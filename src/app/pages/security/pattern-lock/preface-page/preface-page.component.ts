import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { logger } from '@shared/util/log-util';

@Component({
  selector: 'app-preface-page',
  templateUrl: './preface-page.component.html'
})
export class PrefacePageComponent implements OnInit, OnDestroy {
  agreeStatement: boolean = false;
  fromLogin: boolean = false; // 從登入頁進入
  redirectUrl: string = ''; // 設定完圖形密碼後之跳轉頁
  constructor(
    private navigator: NavgatorService,
    private headerCtrl: HeaderCtrlService,
    private alertService: AlertService,
    private auth: AuthService,
    private securityService: SecurityService,
  ) { }

  ngOnInit() {
    if (this.navigator.getParams() === 'fromLogin') {
      this.fromLogin = true;
    }
    this.redirectUrl = this.auth.redirectUrl;
    this.headerCtrl.setLeftBtnClick(() => {
      this.disagree();
    })
  }

  ngOnDestroy() {
    this.auth.redirectUrl = null;
  }


  agree() {
    if (!this.agreeStatement) {
      this.alertService.show('您尚未勾選同意');
    }
    else {
      this.securityService._checkDoBio().then(
        (checkSuccess) => {
          if (this.fromLogin) {
            this.navigator.push('security_patternlock_set', ['fromLogin', this.redirectUrl]);
          } else {
            this.navigator.push('security_patternlock_set');
          }
        },
        (checkError) => {
          logger.error('_checkDoBio error', checkError);
        }
      );
    }
  }

  disagree() {
    // if (this.fromLogin) {
    //   this.navigator.push('user-home'); // 首頁
    // } else {
    //   this.navigator.push("security_ftlogin_set"); // 快速登入設定
    // }

    // 20191212 電金:回到設定頁
    this.navigator.push('security_ftlogin_set'); // 快速登入設定
  }
}
