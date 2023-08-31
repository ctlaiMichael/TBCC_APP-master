// import { Component, OnInit } from '@angular/core';
// import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
// import { NavgatorService } from '@core/navgator/navgator.service';
import { Component, OnInit, ViewChild, HostListener, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { NewsBoardPageComponent } from '@pages/news/news-board/news-board-pages/news-board-page.component';
import { Subject } from 'rxjs/Subject';
import { MsgOverviewService } from '../shared/service/msg-overview.service';
import { PushService } from '@lib/plugins/push.service';
import { LoginRequired } from '@core/auth/login-required.service';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { SetReadObj } from '../component/msg-overview-page/msg-overview-page.component';
import { AuthService } from '@core/auth/auth.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { logger } from '@shared/util/log-util';
// declare var Swiper: any; // 引用外部javascript
@Component({
  selector: 'app-msg-overview-home-page',
  templateUrl: './msg-overview-home-page.component.html',
  styleUrls: ['./msg-overview-home-page.css']
})
export class MsgOverviewHomePageComponent implements OnInit, AfterViewInit, OnDestroy {

  swiper2: any; // 引用外部js
  temp_swiper: any;
  @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
  showContent = false; // 顯示內容頁 false: 列表頁, true 內容頁
  content_data: any; // 內容頁資料
  fullData = [];
  // slidesPerView: number = 3; // 一次顯示的slide item數
  // == 分頁物件 == //
  // @ViewChild('firstpage', { read: ViewContainerRef }) firstpage: ViewContainerRef;
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面
  private _defaultHeaderOption: any;
  activeSwiper = 1; // 目前點選的swiper item
  isRead: Array<boolean> = [true, true, true, true];
  bookmarkData: Array<object> = [];
  activeBookmark = 0; // 0 - 合庫報報，1 - 個人訊息
  activeBookmark2 = 0; // 0 - 全部，1 - 帳務，2 - 提醒，3 - 優惠
  defaultKey = 'public'; // 預設頁面 'public', 'private'
  toPublic: boolean;
  nowPage = ''; // ?
  check_apply:any;
  arg1; arg2; arg3; n1; n2; n3; // 測試用
  constructor(
    private _logger: Logger
    , private _headerCtrl: HeaderCtrlService
    , private _uiContentService: UiContentService
    , private _handleError: HandleErrorService
    , private paginatorCtrl: PaginatorCtrlService
    , private navgator: NavgatorService
    , private msgOverviewService: MsgOverviewService
    , private pushService: PushService
    , private loginRequired: LoginRequired
    , private sessionStorage: SessionStorageService
    , private auth: AuthService
    , private alert: AlertService
    , private navigator: NavgatorService
    , private confirm: ConfirmService
  ) { }

  ngOnInit() {
    const OtpUserInfo = this.auth.getOtpUserInfo();
    this.check_apply = OtpUserInfo.checkBoundIDStatus();
    // this._headerCtrl.setRightSecBadge(0); // 雛型用
    this._logger.error('navgitor',this.navgator.getLastPath());
    this._headerCtrl.setRightBtnClick(() => {
      logger.error('setBtnClick');
      if(this.check_apply.bound_id !== '4'&& this.loginRequired.checkLogin('msg-overview')){
        logger.error('setBtnClick Login');
        this.confirm.show('訊息總覽設定須為裝置綁定，是否前往裝置綁定服務', { title: '裝置綁定服務',btnYesTitle:'是',btnNoTitle:'否'}).then(
          (suc)=>{
            this.navigator.push('device-bind');
          },
          (err)=>{
            this.alert.show('若不綁定裝置則無法綁定推播服務').then(
              resAlert => {
              }
            );
          }
        );
      }else{
        logger.error('setBtnClick not Login');
        this.navgator.push('msg-overview-settings');
      }
    });
    // 登入時(1)須確認為榜定之裝置才可綁定推播服務
    //      (2)若為非綁定之裝置，須詢問是否做裝置綁定
    //        ＊選擇是=>導頁至裝置綁定頁面
    //        ＊選擇否=>顯示訊息:若不綁定裝置則無法綁定推播服務
    if(this.check_apply.bound_id !== '4'){
      this.defaultKey='public';
    }
    this.pageCounter = 1;
    this._defaultHeaderOption = this.navgator.getHeader();
    this.initData();

    // 未登入 - 預設頁面:合庫報報，已登入 - 預設頁面:個人訊息
    if (this.check_apply.bound_id === '4' && this.auth.isLoggedIn()) {
      this.showPrivateMsg();
    }

    // 個人私訊
    // if (this.sessionStorage.get(this.toMsgPrivate) == 'true') {
    //   this.defaultKey = 'private';
    //   this.editable = true;
    //   this.sessionStorage.set(this.toMsgPrivate, null);
    // } else { // 合庫報報
    //   this._logger.log(`this.pushService.deviceGetMsgList() = ${JSON.stringify(this.pushService.deviceGetMsgList())}`);
    // }
  }

  ngOnDestroy() {
    if (this.auth.isLoggedIn()) {
      this._headerCtrl.updateRightSecBadge();
    }
    // this.subscriptionIsReadAll.unsubscribe();
  }

  initData() {
    this.bookmarkData = [
      {
        id: 'public',
        name: '合庫報報',
        sort: 0
      }
      , {
        id: 'private',
        name: '個人訊息',
        sort: 1
      }
    ];
  }

  ngAfterViewInit() {
    // this.swiper2 = new Swiper('.swiper-container_edit', {
    //   slidesPerView: this.slidesPerView,
    //   spaceBetween: 0, // px
    //   navigation: {
    //     prevEl: '.left_arrow',
    //     nextEl: '.right_arrow',
    //   }
    // });
    // this.swiper2.on('init', function () {
    //   document.getElementById('swiper_container_edit').style.paddingRight = "20px";
    //   document.getElementById("right_arrow").style.borderColor = "transparent transparent transparent #6de2cb";
    //   this.swiper2.update();
    // });
    // // 處理滑動swiper的箭頭
    // this.swiper2.on('slideChange', function () {
    //   if (this.isBeginning && !this.isEnd) {
    //     // slide to beginning
    //     document.getElementById('swiper_container_edit').style.paddingLeft = "0px";
    //     document.getElementById('swiper_container_edit').style.paddingRight = "20px";
    //     document.getElementById("left_arrow").style.borderColor = "transparent";
    //     document.getElementById("right_arrow").style.borderColor = "transparent transparent transparent #6de2cb";
    //   } else if (!this.isBeginning && this.isEnd) {
    //     // slide to end
    //     document.getElementById('swiper_container_edit').style.paddingLeft = "20px";
    //     document.getElementById('swiper_container_edit').style.paddingRight = "0px";
    //     document.getElementById("left_arrow").style.borderColor = "transparent #6de2cb transparent transparent";
    //     document.getElementById("right_arrow").style.borderColor = "transparent";
    //   } else if (!this.isBeginning && !this.isEnd) {
    //     // slide to middle
    //     document.getElementById('swiper_container_edit').style.paddingLeft = "10px";
    //     document.getElementById('swiper_container_edit').style.paddingRight = "10px";
    //     document.getElementById("right_arrow").style.borderColor = "transparent transparent transparent #6de2cb";
    //     document.getElementById("left_arrow").style.borderColor = "transparent #6de2cb transparent transparent";
    //   }
    //   this.update(); // 重新render swiper
    // });
  }

  // 顯示"個人訊息"
  private showPrivateMsg() {
    this.defaultKey = 'private';
  }

  /**
   * Scroll Event
   * @param next_page
   */
  onScrollEvent(next_page) {
    logger.error('next_page:',next_page);
    this._logger.step('News', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);
    this.pageCounter = next_page;
    let componentRef: any = this.paginatorCtrl.addPages(this.pageBox, NewsBoardPageComponent);
    componentRef.instance.page = next_page;
    componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
  }


  /**
   * 子層返回事件
   * @param e
   */
  onBackPage(e) {
    this._logger.step('NEWS', 'onBackPage', e);
    let page = 'list';
    let pageType = 'list';
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
    if (page === 'list-item' && pageType === 'page_info') {
      // 設定頁面資料
      if (tmp_data.hasOwnProperty('page_info')
        && this.pageCounter == 1
      ) {
        // 第一頁才要設定，其他不變
        this.totalPages = tmp_data['page_info']['totalPages'];
      }
      return false;
    }

    this.onChangePage(pageType, tmp_data);
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(e) {
    this._logger.step('NEWS', 'onErrorBackEvent', e);
    let page = 'list';
    let pageType = 'list';
    let errorObj: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('type')) {
        pageType = e.type;
      }
      if (e.hasOwnProperty('data')) {
        errorObj = e.data;
      }
    }

    switch (page) {
      case 'list-item':
        // == 分頁返回 == //
        if (this.pageCounter == 1) {
          // 列表頁：首次近來錯誤推頁
          errorObj['type'] = 'message';
          this._handleError.handleError(errorObj);
        } else {
          // 其他分頁錯誤顯示alert錯誤訊息
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
        }
        break;
      case 'content':
        // == 內容返回(先顯示列表再顯示錯誤訊息) == //
        this.onBackPage('list');
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
        break;
    }
  }


  /**
  * 頁面切換
  * @param pageType 頁面切換判斷參數
  *        'list' : 顯示額度使用明細查詢頁(page 1)
  *        'content' : 顯示額度使用明細結果頁(page 2)
  * @param pageData 其他資料
  */
  onChangePage(pageType: string, pageData?: any) {
    if (pageType === 'content') {
      // 內容頁
      this.content_data = pageData;
      this.showContent = true;
    } else {
      // 列表頁
      this.showContent = false;
      this._headerCtrl.updateOption(this._defaultHeaderOption);
    }
    this._uiContentService.scrollTop();
  }

  /**
   * 點選第一層bookmark
   * @param e 第一層bookmark回傳
   */
  onBookMarkBack(e) {
    this.activeBookmark = e.data.sort;
    this._logger.log(`activeBookmark = ${this.activeBookmark}`);
    this._logger.log(e);
    //已登入，無裝置綁定，且點擊個人訊息
    if(this.activeBookmark == 1 && this.check_apply.bound_id !== '4' && this.loginRequired.checkLogin('msg-overview')){
      this.nowPage= 'private';
      this.confirm.show('個人訊息總覽須為裝置綁定，是否前往裝置綁定服務', { title: '裝置綁定服務',btnYesTitle:'是',btnNoTitle:'否'}).then(
        (suc)=>{
          this.navigator.push('device-bind');
        },
        (err)=>{
          this.alert.show('若不綁定裝置則無法綁定推播服務').then(
            resAlert => {
              this._logger.log(`nowPage`,this.nowPage,this.activeBookmark);
              this.nowPage= 'public';
              this._logger.log(`nowPage`,this.nowPage,this.activeBookmark);
            }
          );
        }
      );
    }
    // 如果未登入 且點擊個人訊息
    if (this.activeBookmark != 0 && !this.loginRequired.checkLogin('msg-overview')) {
      this._logger.log(`login to show private message`);
    }
  }

  changeActiveBookmark2(num: number) {
    this.activeBookmark2 = num;
    this.msgOverviewService.activeBookMark2Subject.next(num);
  }


  updateRead(e: SetReadObj) {
    this._logger.log(`SetReadObj = ${JSON.stringify(e)}`);
    e.read.forEach(readBookmark2 => {
      this.isRead[readBookmark2] = true;
    });
    e.notRead.forEach(notReadBookmark2 => {
      this.isRead[notReadBookmark2] = false;
    });
  }

}
