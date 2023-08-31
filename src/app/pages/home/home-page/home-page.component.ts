import { LocalStorageService } from '@lib/storage/local-storage.service';
import { Component, OnInit, AfterViewInit, NgZone, ViewChild, ElementRef } from '@angular/core';

import { MENU_SETTING } from '@conf/menu/main-menu';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { BannerService } from '@pages/home/shared/service/banner.service';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';
import { AuthService } from '@core/auth/auth.service';
import { logger } from '@shared/util/log-util';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '@shared/popup/alert/alert.service';
declare var $: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, AfterViewInit {

  menuFix: any = []; // menu固定資料
  banners = [];
  operateFlag = false;
  count = 0;
  private canvas_query = '.operate_canvas';
  ctx;  //canvas


  constructor(
    private navgator: NavgatorService,
    private zone: NgZone,
    private errorHandler: HandleErrorService,
    private bannerService: BannerService,
    private microInteraction: MicroInteractionService,
    private headerCtrl: HeaderCtrlService,
    private auth: AuthService,
    private localStorageService: LocalStorageService,
    private selfElm: ElementRef,
    private uiContentService: UiContentService,
    private route: ActivatedRoute
    , private alert: AlertService
  ) {
    this.headerCtrl.setHeaderStyle('login');
    // this.navgator.displaymicroBoxSubject.next(false);
    this.microInteraction.displayMicroBox(false);
    this.banners = this.bannerService.getBanners();
    this.bannerService.checkBannerUpdate().then(res => {
      this.banners = res;
    });
  }

  ngOnInit() {
    this._initSet();
  }

  ngAfterViewInit() {
    $('.initial_epay').slick({
      dots: true,
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 4
    });

    this.headerCtrl.setBodyClass(['initial_page']);
    this.zone.run(() => { });
    // logger.log('getGuide afterview', this.uiContentService.getGuide('home'));
    if (this.uiContentService.getGuide('home') != '1') {
      this.canvesPaint();
    }

  }

  private _initSet() {
  	let backLogin=false;
    this.route.queryParams.subscribe((params) => {
      if(params.hasOwnProperty('user')){
        backLogin=true;
        logger.error('params',params);
      }
    });


	let login_method=sessionStorage.getItem("login_method");
    if(login_method){
     if(login_method=='3' && !backLogin){
        logger.error('login_method=3');
        this.navgator.push('login');
        return false;
      }
    }
    // logger.log('getGuide', this.uiContentService.getGuide('home'));
    if (this.uiContentService.getGuide('guide') != '1') {
      this.navgator.push('guide');
      return false;
    }
    if (this.uiContentService.getGuide('home') != '1') {
      this.operateFlag = true;
    } else {
      this.operateFlag = false;
    }
    this.menuFix = MENU_SETTING.FIX;
    this.headerCtrl.updateOption({
      'rightBtnIcon': 'btn_info'
    });
    this.headerCtrl.initRightSecBadge(); // 初始化未讀訊息筆數
  }

  /**
   * 操作手冊
   */
  public canvesPaint() {
    let canvas_obj = this.selfElm.nativeElement.querySelector(this.canvas_query);
    if (typeof canvas_obj == 'undefined' || !canvas_obj) {
      return false;
    }
    let checkDocument = document.getElementsByTagName('section')[0];
    if (typeof checkDocument == 'undefined' || !checkDocument) {
      return false;
    }
    let checkDocument2 = document.getElementById('operate_box');
    if (typeof checkDocument2 == 'undefined' || !checkDocument2) {
      return false;
    }
    let checkDocument3 = document.getElementsByTagName('section')[0];
    if (typeof checkDocument3 == 'undefined' || !checkDocument3) {
      return false;
    }

    let checkDocument4 = document.getElementById('operateImg_1');
    if (typeof checkDocument4 == 'undefined' || !checkDocument4) {
      return false;
    }
    let offset_w = (!!document.body.offsetWidth) ? document.body.offsetWidth : 0;
    let offset_h = (!!document.body.offsetHeight) ? document.body.offsetHeight : 0;
    // 注意寬高是否繪製前消失
    canvas_obj.setAttribute("width", offset_w);
    canvas_obj.setAttribute("height", offset_h);
    if (!!canvas_obj.getContext) {
      this.ctx = canvas_obj.getContext('2d');
      this.ctx.globalAlpha = 0.8;
      this.ctx.fillStyle = "rgba(0,0,0,0.8)";
      this.ctx.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      let headerHeigh = document.body.offsetHeight - document.getElementsByTagName('section')[0].offsetHeight;
      let x1 = document.getElementById('operate_box').offsetLeft + 20;
      let y1 = document.getElementById('operate_box').offsetTop + headerHeigh - 13;
      let x2 = document.getElementById('operate_box').offsetWidth - 40;
      let y2 = document.getElementById('operate_box').offsetHeight + 3;
      this.ctx.clearRect(x1, y1, x2, y2);
      document.getElementById('operateImg_1').style.top = (y1 - document.getElementById('operateImg_1').offsetHeight + 25) + 'px';
    }
  }

  private isNoUseUrl(url: string): boolean {
    const keyword = 'tricoupon';
    const startTime = new Date(2020, 6, 1, 9, 0, 0, 0); // 2020/07/01 09:00
    const endTime = new Date(2021, 0, 1, 0, 0, 0, 0);
    const now = new Date();
    if (url.indexOf(keyword) > -1 && (now < startTime || now >= endTime)) {
      return true;
    }
    return false;
  }

  public go(url) {
    if (this.isNoUseUrl(url)) {
      this.alert.show('109年07月01日 09:00，正式開始登錄', {
        title: '',
        btnTitle: '確定',
      });
    } else {
      this.navgator.push(url);
    }
  }

  public login() {
    this.auth.redirectUrl = null;
    this.navgator.push('login');
  }


  public operateClick() {
    this.count++;
    let checkDocument = document.getElementsByTagName('section')[0];
    if (typeof checkDocument == 'undefined' || !checkDocument) {
      this.operateClick();
      return false;
    }
    let checkDocument2 = document.getElementById('operate_box');
    if (typeof checkDocument2 == 'undefined' || !checkDocument2) {
      this.operateClick();
      return false;
    }
    let checkDocument3 = document.getElementById('operateImg_1');
    if (typeof checkDocument3 == 'undefined' || !checkDocument3) {
      this.operateClick();
      return false;
    }
    let checkDocument4 = document.getElementById('operateImg_2');
    if (typeof checkDocument4 == 'undefined' || !checkDocument4) {
      this.operateClick();
      return false;
    }
    let checkDocument5 = document.getElementById('operateBtn_hand');
    if (typeof checkDocument5 == 'undefined' || !checkDocument5) {
      this.operateClick();
      return false;
    }
    let headerHeigh = document.body.offsetHeight - document.getElementsByTagName('section')[0].offsetHeight;
    if (this.count == 1) {
      this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      this.ctx.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

      let y_top = 8;
      if (document.body.offsetHeight > 700) {
        y_top = 0;
        if (document.body.offsetWidth > 750) {  //ipad
          y_top = -22;
        } else if (document.body.offsetWidth > 412) {
          y_top = -4;
        }
      }

      let y_height = 3;
      if (document.body.offsetHeight < 575) {
        y_height = -9;
      } else if (document.body.offsetHeight < 670) {
        y_height = 2;
      }

      let x1 = document.getElementById('operate_box').offsetLeft + 20;
      let y1 = document.getElementById('operate_box').offsetTop + headerHeigh + document.getElementById('operate_box').offsetHeight - y_top;
      let x2 = document.getElementById('operate_box').offsetWidth - 40;
      let y2 = document.getElementById('operate_box').offsetHeight + y_height;
      let hand=document.getElementById('operateBtn_hand');
      hand.style.top=(y1+(y2*0.15))+'px';
      this.ctx.clearRect(x1, y1, x2, y2);
      document.getElementById('operateImg_2').style.top = (y1 - document.getElementById('operateImg_1').offsetHeight + 25) + 'px';

    }
    if (this.count == 2) {
      this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      this.uiContentService.setGuide('home', '1');

      this.operateFlag = false;
    }
  }
}
