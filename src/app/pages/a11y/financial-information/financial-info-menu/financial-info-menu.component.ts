import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-financial-info-menu',
  templateUrl: './financial-info-menu.component.html',
  styleUrls: ['./financial-info-menu.component.css']
})
export class FinancialInfoMenuComponent implements OnInit {
  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'home',
    rightBtnIcon: 'noshow',
    title: '金融資訊',
    backPath: 'a11yhomekey'
  };
  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private authService: AuthService
  ) {
    this.headerCtrl.setOption(this.obj);
    this.headerCtrl.setLeftBtnClick(() => {
      this.backtohome();
    });
  }

  ngOnInit() {
  }
  backtohome() {
    this.navgator.push('a11yhomekey');
  }
  gowithoutlogin(pagekey) {//是否登陸,以登入轉導致特定頁面 未登入轉導致登入頁面,登入後直接轉至該頁面
    this.navgator.push(pagekey);
  }
}
