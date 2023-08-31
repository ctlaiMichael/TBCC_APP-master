import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HeaderOptions } from '@core/layout/header/header-options';
@Component({
  selector: 'app-a11y-result-page',
  templateUrl: './a11y-result-page.component.html',
  styleUrls: ['./a11y-result-page.component.css']
})
export class A11yResultPageComponent implements OnInit {
  infodata = this.navgator.getParams();//由上一頁點擊後取得之詳細資料
  //標頭
 

  obj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'home',
    rightBtnIcon: 'noshow',
    title: this.infodata.header,
    backPath: 'a11yhomekey'
  };
  //結果
  result = {
      title: '',
      pageType: 'fail',
      content: '',
      button :'返回首頁',
      backType:'a11yhomekey',
      trnsRsltCode:'2'
    }
  constructor(
    private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
  ) {
   
  }

  ngOnInit() {

     let prePageData = this.navgator.getPrePageSet();
    
     
    if (JSON.stringify(this.infodata) != "{}") {
      
      //this.result = this.infodata;
      console.log(this.infodata);
      this.result = {
        title: this.infodata.title?this.infodata.title:this.result.title,
        pageType: this.infodata.pageType?this.infodata.pageType:this.result.pageType,
        content: this.infodata.content?this.infodata.content:this.result.content,
        button :this.infodata.button?this.infodata.button:this.result.button,
        backType:this.infodata.backType?this.infodata.backType:this.result.backType,
        trnsRsltCode:this.infodata.trnsRsltCode?this.infodata.trnsRsltCode:this.result.trnsRsltCode   
        
      }
      if (!!this.infodata.header) {
        
          this.obj.leftBtnIcon=this.infodata.header.leftBtnIcon?this.infodata.header.leftBtnIcon:this.obj.leftBtnIcon;
          this.obj.rightBtnIcon=this.infodata.header.rightBtnIcon?this.infodata.header.rightBtnIcon:this.obj.rightBtnIcon;
          this.obj.title=this.infodata.header.title?this.infodata.header.title:this.obj.title;
          this.obj.backPath=this.infodata.header.backPath?this.infodata.header.backPath:this.obj.backPath;

      } else if (!!prePageData.headerData && !!prePageData.headerData.title) {
          this.obj.title=prePageData.headerData.title;
      }
      this.headerCtrl.setOption(this.obj);
      this.headerCtrl.setLeftBtnClick(() => this.navgator.push(this.obj.backPath));

      if(this.result.trnsRsltCode=='1'){
        this.result.pageType='fail';
      }

      // let prePageData = this.navgator.getPrePageSet();
      // // header.title = this.options.title; // 頭檔資訊不改變
      // console.log(prePageData);
      // if (!!this.infodata.header) {
      //     this.headerCtrl.setOption(this.infodata.header);
      // } else if (!!prePageData.headerData && !!prePageData.headerData.title) {
      //     // // 前一頁設定值資料
      //     // style: 'normal_a11y',
      //     // showMainInfo: false,
      //     // leftBtnIcon: 'back',
      //     // rightBtnIcon: 'noshow',
      //     // title: this.infodata.header,
      //     // backPath: 'a11yhomekey'
      //     // prePageData['style']='normal_a11y';
      //     // prePageData['showMainInfo']='false';
      //     this.headerCtrl.setOption(this.obj);
      // }
    }
  }
  gobacktosettingmenu() {

    this.navgator.push(this.result.backType);
  }
}
