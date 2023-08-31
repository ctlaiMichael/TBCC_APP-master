import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-user-setting-result-a11y-page',
  templateUrl: './user-setting-result-a11y-page.component.html',
  styleUrls: ['./user-setting-result-a11y-page.component.css']
})
export class UserSettingResultA11yPageComponent implements OnInit {
  infodata = this.navgator.getParams();//由上一頁點擊後取得之詳細資料
  //標頭
 

  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',
    rightBtnIcon: 'noshow',
    title: this.infodata.header,
    backPath: 'a11ysettingmenutkey'
  };
  //結果
  result = {
      header: '',
      changenameresult: 'success',
      msg: '',
      pathName :'回個人設定',
      path:'a11ysettingmenutkey'
    }
  constructor(
    private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService
  ) {
    this.headerCtrl.setOption(this.obj);
  }

  ngOnInit() {
    if (JSON.stringify(this.infodata) != "{}") {
      
      //this.result = this.infodata;
      console.log(this.infodata);
      this.result = {
        header: this.infodata.header?this.infodata.header:this.result.header,
        changenameresult: this.infodata.changenameresult?this.infodata.changenameresult:'success',
        msg: this.infodata.msg?this.infodata.msg:this.result.msg,
        pathName :this.infodata.pathName?this.infodata.pathName:'回個人設定',
        path:this.infodata.path?this.infodata.path:'a11ysettingmenutkey'
      }
    }
  }
  gobacktosettingmenu() {

    this.navgator.push(this.result.path);
  }
}
