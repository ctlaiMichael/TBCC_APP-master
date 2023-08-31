import { Component, OnInit, AfterViewInit } from '@angular/core';
// import Swiper from 'swiper/dist/js/swiper.js';
import { AuthService } from '@core/auth/auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-online-loan-desk',
  templateUrl: './online-loan-desk-page.component.html',
  styleUrls: ['./online-loan-desk.component.css']
})
export class OnlineLoanDeskPageComponent implements OnInit{
  // swiper: Swiper;
  // className: string;
  custId: any;
  closeResver = false; //關閉預填單 true:關閉
  flag='0'
  constructor(
    public authService: AuthService,
    private navgator: NavgatorService,
    private _headerCtrl: HeaderCtrlService
  ) {
  }

  ngOnInit() {
    console.log("into online-loan-desk first page");
    this.custId = this.authService.getCustId();
    if (this.navgator.routing_path_header['aa'] == '1'){
      this.flag ='4';
    }
    this._headerCtrl.setLeftBtnClick(() => {
      if(this.flag =='0'){
        this.navgator.push('front-desk');
      }else{
        this.flag='0';
      }
    });
  }
  
  chgFlag(flagNo){
    if(flagNo=='1'){
      this.flag='1';
    }else if(flagNo=='2'){
      this.flag='2';
    }else if(flagNo=='3'){
      this.flag='3';
    }else if(flagNo=='4'){
      this.flag='4';
    }else{
      this.flag='0';
    }
  }
  // ngAfterViewInit() {
    // let main_item = '.' + this.className + '-swiper-container';
    // let main_item = '.main-box';
    // let page_item = '.item-pagination';
    // this.swiper = this.swiper || new Swiper(main_item, {
      // autoHeight: true,//内容高度不一樣，讓分頁器隨著內容高度移動
      // pagination: {
      //   el: page_item,
      //   renderBullet: function (index, className, text) {
          //正常
          // switch (index) {
          //   case 0: text = '房屋增貸'; break;
          //   case 1: text = '房屋貸款'; break;
          //   case 2: text = '信用貸款'; break;
          // }
          // return '<div class="d-inline-block pad-rgt-1">' + '<div class="' + className + '">' + '</div>' + '<div class="inner_content_news">' + text + '</div>' + '</div>';
          //關閉預填單
          // switch (index) {
          //   case 0: text = '房屋增貸'; break;
          //   case 1: text = '信用貸款'; break;
          // }
          // return '<div class="d-inline-block pad-rgt-1">' + '<div class="' + className + '">' + '</div>' + '<div class="inner_content_news">' + text + '</div>' + '</div>';
      //   }
      // }
  //   });
  // }

  //房貸增貸 立即申請
  onMortgage() {
    this.checkCustId('mortgage');
  }
  //房屋貸款 預約申請
  onHouse() {
    this.checkCustId('house');
  }
  //信用貸款 預約申請
  onCreditResver() {
    this.checkCustId('creditResver');
  }
  //信用貸款 立即申請
  onCreditNow() {
    this.checkCustId('creditNow');
  }
  //勞工紓困貸款 預約申請
  onBailoutResver() {
    this.checkCustId('bailoutResver');
  }

  //勞工紓困貸款 立即申請
  onBailoutNow() {
    this.checkCustId('bailoutNow');
  }

  checkCustId(checkData) {
    switch (checkData) {
      case "mortgage":
        //房貸增貸 需登入
        this.navgator.push('mortgage-loan');
        break;
      case "house":
        //房屋貸款 不須登入
        this.navgator.push('house-loan');
        break;
      case "creditResver":
        //信用貸款 預約不須登入
        this.navgator.push('credit-resver-loan');
        break;
      case "creditNow":
        //信用貸款 及時需登入
        this.navgator.push('credit-loan');
        break;
      case "bailoutResver":
        //勞工紓困貸款 預約不須登入
        this.navgator.push('bail-out-loan');
        break;
      case "bailoutNow":
        //勞工紓困貸款 預約不須登入
        this.navgator.push('credit-loan1');
        break;
    }
  }
}
