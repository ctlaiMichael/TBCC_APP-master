import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-guide-a11y-page',
  templateUrl: './guide-a11y-page.component.html'
})
export class GuideA11yPageComponent implements OnInit {
  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'home',
    rightBtnIcon: 'noshow',
    title: '功能導覽',
    backPath: 'a11yhomekey'
  };
  login_move: string = '';

  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private authService: AuthService) {
    this.headerCtrl.setOption(this.headerObj);
    this.headerCtrl.setLeftBtnClick(() => { // 左邊button
      this.goHomePage();
    });

  }

  ngOnInit() {
    this.login_move = this.authService.isLoggedIn() ? '登出' : '登入';
  }

  go(pagekey) { // 是否登入,已登入轉導至特定頁面 未登入轉導致登入頁面
    if (!this.authService.isLoggedIn()) {
      this.navgator.push('a11yloginkey', pagekey);
    } else {
      this.navgator.push(pagekey);
    }
  }
  gowithoutlogin(pagekey) {//是否登陸,以登入轉導致特定頁面 未登入轉導致登入頁面,登入後直接轉至該頁面
    this.navgator.push(pagekey);
  }
  loginLogout() {
    if (this.authService.isLoggedIn()) {
      this.authService.a11ylogout().then(
        () => {
          this.navgator.push('a11yhomekey');
        }
      );
    } else {
      this.navgator.push('a11yloginkey', 'a11yguidekey');
    }
  }

  goHomePage() { // 左邊button
    this.navgator.push('a11yhomekey');
  }
}
