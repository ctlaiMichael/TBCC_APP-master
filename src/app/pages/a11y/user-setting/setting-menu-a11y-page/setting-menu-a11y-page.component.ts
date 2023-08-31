import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-setting-menu-a11y-page',
  templateUrl: './setting-menu-a11y-page.component.html',
  styleUrls: ['./setting-menu-a11y-page.component.css']
})
export class SettingMenuA11yPageComponent implements OnInit {
  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon:'home',
    rightBtnIcon: 'noshow',
    title: '個人設定',
    backPath: 'a11yhomekey'
  };
  constructor(
    private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private authService: AuthService
    ) {
    this.headerCtrl.setOption(this.obj);
    this.headerCtrl.setLeftBtnClick(()=>{
      this.backtohome();
    });
   }

  ngOnInit() {
  }
  backtohome() {
    this.navgator.push('a11yhomekey');
  }
  gowithlogin(pagekey) {//是否登陸,以登入轉導致特定頁面 未登入轉導致登入頁面,登入後直接轉至該頁面
    if (!this.authService.isLoggedIn()) {
      this.navgator.push('a11yloginkey', pagekey);
    } else {
      this.navgator.push(pagekey);
    }
  }
}
