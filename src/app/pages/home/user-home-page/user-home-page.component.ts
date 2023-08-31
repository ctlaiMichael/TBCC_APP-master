/**
 * 登入後首頁
 */
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { LeftMenuService } from '@core/layout/left-menu/left-menu.service';
import { CommonUtil } from '@shared/util/common-util';
import { PersonalInfo } from '@core/layout/header/personal-info';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Logger } from '@core/system/logger/logger.service';
import { UserHomeService } from '@pages/home/shared/service/user-home.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { logger } from '@shared/util/log-util';
declare var $: any;
@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.css'],
  providers: [UserHomeService]
})

export class UserHomePageComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * 參數處理
   */
  // 確認資料取得狀態處理
  private canShowPage = false;
  private assetsData = new PersonalInfo();
  private finishData = {
    assets: false,
    deposit: false,
    bill: false,
    gold: false,
    forex: false,
    card: false
  };
  private haveData = {
    deposit: false,
    bill: false,
    gold: false,
    forex: false,
    card: false
  };
  private mainBlockOrder = [0, 1, 2];
  private alreadyExec = {
    gold: false,
    forex: false,
    card: false
  };
  count = 0;
  operateFlag = false;
  ctx;  //canvas
  constructor(
    private headerCtrl: HeaderCtrlService,
    public leftMenu: LeftMenuService,
    private _logger: Logger,
    private _mainService: UserHomeService,
    private localStorage: LocalStorageService,
    private navgator: NavgatorService,
    private selfElm: ElementRef,
    private localStorageService: LocalStorageService,
    private uiContentService: UiContentService
  ) {
    headerCtrl.setBodyClass(['inner_page', 'home_page']);
    headerCtrl.setLeftBtnClick(this.toggleMenu);
    const mainBlock = localStorage.getObj('mainBlock');
    if (!!mainBlock) {
      this.mainBlockOrder = mainBlock.map(item => item.id);
    }

    // 預設資產資訊先不顯示
    let assets_data = new PersonalInfo();
    let empty_str = '- -';
    assets_data.bill = empty_str;
    assets_data.deposit = empty_str;
    this.headerCtrl.setPersonalInfo(assets_data);
  }

  ngOnDestroy() {
    this.leftMenu.headerSetClose();
  }

  ngAfterViewInit() {
    let getParams = this.navgator.getParams();
    if (typeof getParams === 'object' && !!getParams.nextUrl &&
      (getParams.nextUrl === 'qrcodeShowPay' ||
        getParams.nextUrl === 'qrcodeShowReceipt' ||
        getParams.nextUrl === 'epayscan')) {

      this.navgator.deleteParams();
      this.navgator.push('epay', { 'nextUrl': getParams.nextUrl });
      return;
    }
    this.canShowPage = true;
    this._logger.step('HomePage', 'is after view init');
    this.setBoxOrder();

    if (this.uiContentService.getGuide('user-home') != '1') {
      setTimeout(() => {
        this.canvesPaint();
      });
    }
  }

  setBoxOrder() {
    let wrapper = $('.info_block_area'),
      items = wrapper.children('.info_block'),
      arr = this.mainBlockOrder;  // 順序

    // items.detach(); if arr doesn't reuse all items
    wrapper.append($.map(arr, function (v) { return items[v]; }));
  }

  ngOnInit() {
    const bodyScrollTop: any = document.getElementsByTagName('section');
    if (!!bodyScrollTop[0]) {
      const obj = bodyScrollTop[0];
      let change_luck_flag = false; // 防止在angularJS讓畫面改變時，scroll事件重複觸發，導置閃爍中猴現象
      let pre_scroll = 0;
      const scrollEvents$ = Observable.fromEvent(obj, 'scroll')
        .subscribe((e: any) => {
          let now_scroll = (!!e.target.scrollTop) ? e.target.scrollTop : 0;
          let scroll_range = (!!pre_scroll) ? (now_scroll - pre_scroll) : 0;
          if (now_scroll < 50) {
            this.leftMenu.headerSetClose();
          }
          if (!!change_luck_flag) {
            return false;
          }
          if (now_scroll > 90) {
            change_luck_flag = true;
            this.leftMenu.headerSetOpen();
          } else {
            change_luck_flag = true;
            this.leftMenu.headerSetClose();
          }
          setTimeout(() => {
            change_luck_flag = false;
          }, 100);
        });
    }
    CommonUtil.wait(1000).then(() => {
      this._logger.log('init');
      function toggle() {
        this.leftMenu.toggle();
      }
      $('#nav_left_menu_button').click(toggle);
    });

    // 首頁樣式固定處理
    this.headerCtrl.setOption({
      style: 'user_home',
      leftBtnIcon: 'menu',
      title: 'logo',
      showMainInfo: true,
      rightBtnIcon: 'nav_right_edit_button'
    });

    this._initEvent(); // 取資料開始
    logger.error('user-home', this.uiContentService.getGuide('user-home'));

    if (this.uiContentService.getGuide('user-home') != '1') {
      this.operateFlag = true;
    } else {
      this.operateFlag = false;
    }
  }

  toggleMenu() {
    this.leftMenu.toggle();
  }

  /**
   * 區塊返回事件
   * @param e data
   */
  onPageBackEvent(e) {
    this._logger.step('HomePage', 'onPageBackEvent', e);
    let page = '';
    let pageType = '';
    let tmp_data: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('type')) {
        pageType = e.type;
      }
      if (e.hasOwnProperty('data')) {
        tmp_data = e.data;
      }
    }

    if (page === 'gold' || page === 'card' || page === 'forex') {
      switch (page) {
        case 'gold':
          this.alreadyExec.gold = true;
          break;
        case 'card':
          this.alreadyExec.card = true;
          break;
        case 'forex':
          this.alreadyExec.forex = true;
          break;
      }
      const alreadyExec = (this.alreadyExec.gold && this.alreadyExec.forex && this.alreadyExec.card) ? true : false;
      this.headerCtrl.setCheckFinishStatus(alreadyExec);
    }

    if (pageType === 'success' && this.haveData.hasOwnProperty(page)) {
      this.haveData[page] = true; // 成功取資料註記
    }
    this.callBackCheckEvent(page, tmp_data);
  }



  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

  private _initEvent() {
    // 預設資產資訊先不顯示
    // let default_assets = new PersonalInfo();
    // this.assetsData.deposit = '';
    // this.assetsData.bill = '';
    // this.headerCtrl.setPersonalInfo(this.assetsData);

    // 資產總覽
    this._mainService.getAssets().then(
      (resObj) => {
        // 2019/12/09 我的金庫改寫
        // console.warn('assets', JSON.stringify(resObj));
        this.assetsData.deposit = (resObj.data.deposit !== '') ? resObj.data.deposit : '';
        this.assetsData.bill = (resObj.data.bill !== '') ? resObj.data.bill : '';
        this.assetsData.twd = (resObj.data.twd !== '') ? resObj.data.twd : '';
        this.assetsData.forex = (resObj.data.forex !== '') ? resObj.data.forex : '';
        this.assetsData.fund = (resObj.data.fund !== '') ? resObj.data.fund : '';
        this.assetsData.gold = (resObj.data.gold !== '') ? resObj.data.gold : '';

        if (resObj.close) {
          this.assetsData.deposit = '';
          this.assetsData.fund = '';
        }

        this.haveData.deposit = resObj.error_deposit.status;
        this.haveData.bill = resObj.error_bill.status;
        this.callBackCheckEvent('assets', resObj);
      },
      (errorObj) => {
        this._logger.error('HomePage', 'error assets:', errorObj);
        this.callBackCheckEvent('assets', errorObj);
      }
    );

  }

  /**
   * 判斷個區塊資料返回，決定頁面是否顯示
   */
  private callBackCheckEvent(finish_type, resObj) {
    if (this.finishData.hasOwnProperty(finish_type)) {
      this.finishData[finish_type] = true;
    }
    if (['assets', 'deposit', 'bill'].indexOf(finish_type) > -1) {
      // 重新定義Header data
      this.headerCtrl.setPersonalInfo(this.assetsData);
    }

    const check_finish = (this.finishData.gold && this.finishData.forex && this.finishData.card) ? true : false;

    // 顯示頁面條件
    if (this.canShowPage && (
      this.haveData.gold || this.haveData.forex || this.haveData.card
      || check_finish
    )) {
      this._logger.step('HomePage', 'do pageInitEnd');
      this.navgator.pageInitEnd(); // 取得資料後顯示頁面
    }

  }

  public canvesPaint() {
    let canvas_obj = this.selfElm.nativeElement.querySelector('.operate_canvas');
    //禁止滑動
    (<any>document).addEventListener('touchmove', this.handler, { passive: false });
    if (typeof canvas_obj == 'undefined' || !canvas_obj) {
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

      let checkDocument = document.getElementsByClassName('row_single fastLink headerBtn')[0];
      if (typeof checkDocument == 'undefined' || !checkDocument) {
        return false;
      }
      let checkDocument2 = document.getElementById('main_info');
      if (typeof checkDocument2 == 'undefined' || !checkDocument2) {
        return false;
      }
      let checkDocument3 = document.getElementById('operateImg_5');
      if (typeof checkDocument3 == 'undefined' || !checkDocument3) {
        return false;
      }
      let checkDocument4: any = document.getElementsByClassName('menu')[0];
      if (typeof checkDocument4 == 'undefined' || !checkDocument4) {
        return false;
      }
      checkDocument4.style.zIndex = "99";
      let x1 = document.getElementsByClassName('row_single fastLink headerBtn')[0]['offsetLeft'] + 20;
      let y1 = 60;
      let x2 = document.getElementsByClassName('row_single fastLink headerBtn')[0]['offsetWidth'] - 40;
      let y2 = document.getElementById('main_info')['offsetHeight'] + 20;
      this.ctx.clearRect(x1, y1, x2, y2);
      document.getElementById('operateImg_5').style.top = (y1 + y2) + 'px';
    }
  }
  operateClick() {
    this.count++
    if (this.count == 1) {
      let checkDocument = document.getElementsByClassName('nav_right_edit_button')[0];
      if (typeof checkDocument == 'undefined' || !checkDocument) {
        this.operateClick();
        return false;
      }
      let checkDocument2 = document.getElementById('operateImg_6');
      if (typeof checkDocument2 == 'undefined' || !checkDocument2) {
        this.operateClick();
        return false;
      }
      this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      this.ctx.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      let x1 = document.getElementsByClassName('nav_right_edit_button')[0]['offsetLeft'];
      let y1 = document.getElementsByClassName('nav_right_edit_button')[0]['offsetTop'];
      this.ctx.clearRect(x1, y1, 35, 35);
      document.getElementById('operateImg_6').style.top = (y1 + 35) + 'px';
    } else if (this.count == 2) { //微交互
      logger.error('btn trigger plus_btn', document.getElementsByClassName('btn trigger plus_btn')[0])
      let checkDocument = document.getElementsByClassName('btn trigger plus_btn')[0];
      if (typeof checkDocument == 'undefined' || !checkDocument) {
        this.operateClick();
        return false;
      }
      let checkDocument2 = document.getElementById('operateImg_7');
      if (typeof checkDocument2 == 'undefined' || !checkDocument2) {
        this.operateClick();
        return false;
      }
      this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      this.ctx.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      let x1 = document.body.offsetWidth * 0.9 - 45;
      let y1 = document.body.offsetHeight * 0.88;
      let x2 = document.getElementsByClassName('btn trigger plus_btn')[0]['offsetWidth'] + 10;
      let y2 = document.getElementsByClassName('btn trigger plus_btn')[0]['offsetHeight'] + 10;
      this.ctx.clearRect(x1, y1, x2, y2);
      let scroll = 125;
      if (document.body.offsetHeight > 700) {
        scroll = 160;
        if (document.body.offsetWidth > 750) { //for ipad
          scroll = 230;
        }
      } else if (document.body.offsetHeight > 650) {
        scroll = 145;
      }
      document.getElementById('operateImg_7').style.top = (document.body.offsetHeight * 0.88 - scroll) + 'px';
    } else if (this.count == 3) { //智能客服
      let checkDocument = document.getElementsByClassName('tcb_mascot_img')[0];
      if (typeof checkDocument == 'undefined' || !checkDocument) {
        this.operateClick();
        return false;
      }
      let checkDocument2 = document.getElementById('operateImg_8');
      if (typeof checkDocument2 == 'undefined' || !checkDocument2) {
        this.operateClick();
        return false;
      }
      let checkDocument3 = document.getElementById('main_info');
      if (typeof checkDocument3 == 'undefined' || !checkDocument3) {
        this.operateClick();
        return false;
      }
      this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      this.ctx.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      let x1 = document.getElementsByClassName('tcb_mascot_img')[0]['offsetLeft'] + 10;
      let y1 = document.getElementById('main_info').offsetTop - 20;
      this.ctx.clearRect(x1, y1, 60, 66);
      document.getElementById('operateImg_8').style.top = (y1 + 50) + 'px';

    } else if (this.count == 4) { //漢堡

      let checkDocument = document.getElementsByClassName('nav_left_menu_button active')[0];
      if (typeof checkDocument == 'undefined' || !checkDocument) {
        this.operateClick();
        return false;
      }
      this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      this.ctx.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      let x1 = document.getElementsByClassName('nav_left_menu_button active')[0]['offsetLeft'];
      let y1 = document.getElementsByClassName('nav_left_menu_button active')[0]['offsetTop'];
      let x2 = document.getElementsByClassName('nav_left_menu_button active')[0]['offsetWidth'];
      let y2 = document.getElementsByClassName('nav_left_menu_button active')[0]['offsetHeight'];
      this.ctx.clearRect(x1, y1, x2, y2);

    // } else if (this.count == 5) { //左側登出按鈕
      // this.headerCtrl.setBodyClass(['inner_page', 'home_page', 'menu_open']);

      //   let checkDocument = document.getElementsByClassName('inner_button')[6];
      //   if (typeof checkDocument == 'undefined' || !checkDocument) {
      //     this.operateClick();
      //     return false;
      //   }
      //   let checkDocument2 = document.getElementsByClassName('nav_bottom_frame')[0];
      //   if (typeof checkDocument2 == 'undefined' || !checkDocument2) {
      //     this.operateClick();
      //     return false;
      //   }

      //   this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      //   this.ctx.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      //   let x1 = document.getElementsByClassName('inner_button')[6]['offsetLeft']-2;
      //   let y1 = document.body.offsetHeight-document.getElementsByClassName('inner_button')[6]['offsetHeight']-22;
      //   let x2 = document.getElementsByClassName('inner_button')[6]['offsetWidth']+4;
      //   let y2 = document.getElementsByClassName('inner_button')[6]['offsetHeight']+4;
      //   this.ctx.clearRect(x1, y1, x2, y2)

    } else if (this.count == 5) { //開始體驗

      this.headerCtrl.setBodyClass(['inner_page', 'home_page']);
      this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      this.ctx.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

    } else if (this.count == 6) {
      let checkDocument4: any = document.getElementsByClassName('menu')[0];
      if (typeof checkDocument4 == 'undefined' || !checkDocument4) {
        return false;
      }
      checkDocument4.style.zIndex = "9000";
      this.ctx.clearRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);
      //解除禁止滑動
      (<any>document).removeEventListener('touchmove', this.handler, { passive: true });
      this.operateFlag = false;
      this.uiContentService.setGuide('user-home', '1');
    }
  }
  handler(e) {
    e.preventDefault();
  }
}
