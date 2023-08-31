import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { SplashScreenService } from '@lib/plugins/splash-screen.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { A11yConfirmService } from '@shared/popup/a11y/confirm/confirm.service';

@Component({
  selector: 'app-home-memu-a11y-page',
  templateUrl: './home-memu-a11y-page.component.html',
  styleUrls: ['./home-memu-a11y-page.component.css']
})
export class HomeMemuA11yPageComponent implements OnInit {
  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'noshow',
    rightBtnIcon: 'login',
    title: '合作金庫',
    backPath: ''
  };
  login_status;
  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private splashScreen: SplashScreenService,
    private authService: AuthService,
    private _localStorage: LocalStorageService,
    private _a11yConfirm: A11yConfirmService
  ) {
    this.login_status = this.authService.isLoggedIn();//登入狀態
    if (this.login_status === true) {
      this.obj.rightBtnIcon = 'logout';
    } else {
      this.obj.rightBtnIcon = 'login';
    }
    // this.headerCtrl.setHeaderStyle('normal_a11y');
    this.headerCtrl.setOption(this.obj);
    //this.headerCtrl.setRightBtnClick(this.loginMethod);
    this.headerCtrl.setRightBtnClick(() => {//右邊button
      this.onBackPageData();
    });



  }
  infodata = this.navgator.getParams();//由上一頁點擊後取得之詳細資料

  ngOnInit() {
    this.login_status = this.authService.isLoggedIn();//登入狀態
    this.splashScreen.hide();
    if (this.login_status === true) {
      this.obj.rightBtnIcon = 'logout';
      this.headerCtrl.setOption(this.obj);
    } else {
      this.obj.rightBtnIcon = 'login';
      this.headerCtrl.setOption(this.obj);
    }
  }

  gowithoutlogin(pagekey) {
    //轉導至該頁面
    this.navgator.push(pagekey);
  }
  gowithlogin(pagekey) {
    //是否已登入成功,以登入轉導至特定頁面 未登入轉導至登入頁面,登入後直接轉至該頁面
    if (!this.authService.isLoggedIn()) {
      this.navgator.push('a11yloginkey', pagekey);
    } else {
      this.navgator.push(pagekey);
    }
  }

  exitA11y() {
    this._a11yConfirm.show('您即將切換至行動網銀完整版', {title: '提醒您'}).then(() => {
        this._localStorage.setObj('appMode', {isA11y: false, backNormal: true});
        this.navgator.setRoot('');
        window.location.reload();
      },
      () => {
        // 取消 Do nothting
      }
    );
  }

  onBackPageData() {
    // 重新取得登入狀態
    this.login_status = this.authService.isLoggedIn();//登入狀態

    // 判斷因閒置時間登出後，點擊登入btn，轉跳至登入頁
    if (!this.login_status  && this.obj.rightBtnIcon === 'logout') {
      this.navgator.push('a11yloginkey');
    } else if (this.obj.rightBtnIcon === 'logout') {
    //右邊button
      this.authService.a11ylogout(); // 登出
      this.obj.rightBtnIcon = 'login';
      this.login_status = false;
      this.headerCtrl.setOption(this.obj);
    } else {
      this.navgator.push('a11yloginkey');
    }

  }
}
