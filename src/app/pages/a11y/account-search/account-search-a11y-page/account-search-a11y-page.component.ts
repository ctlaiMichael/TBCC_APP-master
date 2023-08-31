import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-account-search-a11y-page',
  templateUrl: './account-search-a11y-page.component.html',
  styleUrls: ['./account-search-a11y-page.component.css']
})
export class AccountSearchA11yPageComponent implements OnInit {
    obj = {
      style: 'normal_a11y',
      showMainInfo:false,
      leftBtnIcon:'home',
      rightBtnIcon:'noshow',
      title:'帳戶查詢',
      backPath:'', 
    };
  constructor(private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private authService: AuthService
    ) {
    //this.headerCtrl.setHeaderStyle('normal_a11y');
    this.headerCtrl.setOption(this.obj);
    this.headerCtrl.setLeftBtnClick(() => {//右邊button
      this.gohome();
    });
   }

  ngOnInit() {

  }
  gohome(){
    this.navgator.push('a11yhomekey');
  }

  //TODO 加上從登入頁導回功能畫面判斷
  gowithlogin(pagekey) {//是否登陸,以登入轉導致特定頁面 未登入轉導致登入頁面,登入後直接轉至該頁面
    if(!this.authService.isLoggedIn()){
      this.navgator.push('a11yloginkey',pagekey);
    }else{
      this.navgator.push(pagekey);
    }
  }

}
