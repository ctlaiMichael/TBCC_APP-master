import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { SecurityService } from '@pages/security/shared/service/security.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { logger } from '@shared/util/log-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
@Component({
  selector: 'app-fastlogin-agree',
  templateUrl: './fastlogin-agree.component.html',
  styleUrls: ['./fastlogin-agree.component.css']
})
export class FastloginAgreeComponent implements OnInit {

  fromLogin: boolean = false; // 從登入頁直接進入此頁

  constructor(
    private headerCtrl: HeaderCtrlService,
    private securityservice: SecurityService,
    private alert: AlertService,
    private navgator: NavgatorService,
    private errorHandle: HandleErrorService
  ) {
    this.fromLogin = this.navgator.getParams() === 'fromLogin';
    this.headerCtrl.setLeftBtnClick(() => {
      this.cancel();
    });
  }

  check_agree = false;

  ngOnInit() {
    this.headerCtrl.setBodyClass(['inner_page']);

    // check allow
    let check_allow = this.securityservice.checkAllowDevice();
    if (!check_allow.allow) {
      check_allow.error['type'] = 'dialog';
      this.errorHandle.handleError(check_allow.error).then(
        () => {
          this.cancel();
        }
      );
    }
  }

  agree() {
    if (!this.check_agree) {
      this.alert.show('您尚未勾選同意', { title: '錯誤' }).then((res) => { });
      return;
    }
    this.securityservice.submitFtligon().then(
      (res) => {
        this.navgator.push('user-home');
        logger.error('submitFtligon', res);
      }
    ).catch(
      (err) => {
        // this.navgator.push('user-home');
        logger.error('submitFtligon error', err);
      });
  }

  cancel() {
    // if (this.fromLogin) {
    //   this.navgator.push('user-home');
    // } else {
    //   this.navgator.push('security_ftlogin_set');
    // }

    // 20191212 電金:回到設定頁
    this.navgator.push('security_ftlogin_set');
  }

  /**
   * 確認是否同意條款
   */
  check() {
    this.check_agree = !this.check_agree;
  }

}
