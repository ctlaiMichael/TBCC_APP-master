/**
 * 基金轉換-列表
 */
import { Component, OnInit, ViewChild, HostListener, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { FundConvertPageComponent } from './pages/fund-convert-page.component';
import { AuthService } from '@core/auth/auth.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { FundInformationReserve } from '@conf/terms/fund/fund-information-reserve';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { logger } from '@shared/util/log-util';
// == 分頁 End == //
@Component({
  selector: 'app-fund-convert',
  templateUrl: './fund-convert.component.html',
  providers: []
})
export class FundConvertComponent implements OnInit {
  /**
   * 參數處理
   */
  @ViewChild('pageBoxS', { read: ViewContainerRef }) pageBoxS: ViewContainerRef;
  @ViewChild('pageBoxM', { read: ViewContainerRef }) pageBoxM: ViewContainerRef;
  showContent = false; // 顯示內容頁 false: 列表頁, true 內容頁
  convertType = '';
  page_data: any; // 頁面資料
  content_data: any; // 內容頁資料
  fullData = [];
  nowType: any = {};
  showData = false;
  data = [];
  dataType = [];
  swtichFlag = '1';
  reserveFlag = false;

  // == 分頁物件 == //
  // @ViewChild('firstpage', { read: ViewContainerRef }) firstpage: ViewContainerRef;
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面
  private _defaultHeaderOption: any;
  trnsType = '3';
  constructor(
    private _logger: Logger
    , private _headerCtrl: HeaderCtrlService
    , private _uiContentService: UiContentService
    , private _handleError: HandleErrorService
    , private paginatorCtrl: PaginatorCtrlService
    , private navgator: NavgatorService
    , public authService: AuthService
    , private router: Router
    , private infomationService: InfomationService
    , private confirm: ConfirmService
    , private alert: AlertService
  ) { }

  ngOnInit() {
    this.pageCounter = 1;
    this._defaultHeaderOption = this.navgator.getHeader();
  }

  /**
   * Scroll Event
   * @param next_page
   */
  onScrollEvent(next_page) {
    this._logger.step('FUND', 'onScrollEvent: ', this.pageCounter, this.totalPages, next_page);
    this._logger.step('FUND', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);
    this._logger.step('FUND', 'this.paginatorCtrl: ', this.paginatorCtrl);
    let now_box: any;
    switch (this.swtichFlag) {
      case '1':
        now_box = this.pageBoxS;
        break;
      case '2':
        now_box = this.pageBoxM;
        break;
    }
    this.pageCounter = next_page;
    const componentRef: any = this.paginatorCtrl.addPages(now_box, FundConvertPageComponent);
    componentRef.instance.page = next_page;
    componentRef.instance.setData = this.page_data;
    componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
  }

  /**
   * 子層返回事件
   * @param e
   */
  onBackPage(e) {
    this._logger.step('FUND', 'onBackPage', e);
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
    this._logger.step('FUND', '參照(B)tmp_data / page / pageType: ', tmp_data, page, pageType);
    if (page === 'list-item' && pageType === 'page_info') {
      if(e.data.hasOwnProperty('reserveFlag')){
        if(e.data.reserveFlag==true){
          this.reserveFlag=true;
        }
      }
      logger.error('lllllllllllllllll')
      // 設定頁面資料
      if (tmp_data.hasOwnProperty('page_info')
        && this.pageCounter === 1
      ) {
        // 第一頁才要設定，其他不變
        this.totalPages = tmp_data['page_info']['totalPages'];
      }
      this._logger.step('FUND', '參照(B)pageCounter / totalPages: ', this.pageCounter, this.totalPages);
      return false;
    }

    if (page == 'enter-agree' && pageType == 'success') {
      if (tmp_data == true) {
        this.convertType = 'SelectSingle';
      } else {
        this.backMenuPage();
      }
      this._logger.step('FUND', 'BACK FROM AGREE');
    }

    this.onChangePage(pageType, tmp_data);
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(e) {
    this._logger.step('FUND', 'onErrorBackEvent', e);
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
        if (this.pageCounter === 1) {
          // 列表頁：首次近來錯誤推頁
          this.erroShowMsg(errorObj);
          this.navgator.push('fund');
        } else {
          // 其他分頁錯誤顯示alert錯誤訊息
          this.erroShowMsg(errorObj);
          this.navgator.push('fund');
        }
        break;
      case 'content':
        // == 內容返回(先顯示列表再顯示錯誤訊息) == //
        this.onChangePage('list');
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
        break;
    }
  }

  /* 中台錯誤訊息回傳
   * 請參考FundErrorChecker.java
  */


  erroShowMsg(errorObj) {
    if (errorObj.resultCode == 'ERR1C115') {
      // 按鈕: 繼續 離開
      this.confirm.show('現在已超過本日交易時間，或非營業日，如您欲以預約方式申購請點選「繼續」！', {
        title: '提醒您',
        btnYesTitle: '繼續',
        btnNoTitle: '離開'
      }).then(
        () => {
          // 選擇繼續
          this.trnsType='5';
          this.reserveFlag = true;
          this.convertType = 'SelectSingle';
        },
        () => {
          // 選擇離開
          this.backMenuPage();
        }
      );
    } else if (errorObj.resultCode == 'ERR1C101') {
      // 按鈕: 風險承受度測驗 取消
      this.confirm.show('親愛的客戶您好，您尚未申請網路銀行基金下單，請至營業單位臨櫃辦理網路銀行基金下單功能', {
        title: '提醒您',
        btnYesTitle: '風險承受度測驗',
        btnNoTitle: '取消'
      }).then(
        () => {
          // 選擇風險承受度測驗
          this.navgator.push('fund-group-resk-test');
        },
        () => {
          // 選擇取消
          this.backMenuPage();
        }
      );
    } else if (errorObj.resultCode == 'ERR1C102') {
      // 按鈕: 風險承受度測驗 取消
      this.confirm.show('親愛的客戶您好:您尚未申請忘錄銀行基金下單，請與往來分行獲全省各地分行洽詢。謝謝。', {
        title: '提醒您',
        btnYesTitle: '風險承受度測驗',
        btnNoTitle: '取消'
      }).then(
        () => {
          // 選擇風險承受度測驗
          this.navgator.push('fund-group-resk-test');
        },
        () => {
          // 選擇取消
          this.backMenuPage();
        }
      );
      //
    } else if (errorObj.resultCode == 'ERR1C103') {
      // 按鈕: 我知道了
      this.alert.show('親愛的客戶您好，您已超過一年以上未作風險承受度測驗，未充分瞭解您目前的投資風險承受度狀況，請點選下方按鈕進行「風險承受度測驗」後，再重新進行基金下單交易。', {
        title: '提醒您',
        btnTitle: '我知道了',
      }).then(
        () => {
          // 選擇取消
          this.backMenuPage();
        }
      );
    } else if (errorObj.resultCode == 'ERR1C105') {
      // 按鈕: 我知道了
      this.alert.show('設定的交易日非營業日', {
        title: '提醒您',
        btnTitle: '我知道了',
      }).then(
        () => {
          // 選擇取消
          this.backMenuPage();
        }
      );
    } else {
      errorObj['type'] = 'dialog';
      this._handleError.handleError(errorObj);
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
      this._logger.step('FUND', 'in content');
      this.showContent = true;
      this.content_data = pageData;
    } else {
      // 列表頁
      this.showContent = false;
      this._headerCtrl.updateOption(this._defaultHeaderOption);
      this._resetPage();
    }
  }

  // 子頁回傳時，頁數需歸零，否則會繼續計算
  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }

  public backMenuPage() {
    this.navgator.push('fund');
  }

  public switchPage(sflag) {
   
    this.swtichFlag = sflag;
    if (sflag == '1') {
      
      if(!this.reserveFlag){
        this.trnsType='3';
      }else{
        this.trnsType='5';
      }
      this.convertType = 'SelectSingle';
    } else if (sflag == '2') {
      this.trnsType='4';
      this.convertType = 'SelectMultiple';
    }
    this._resetPage();
    this._logger.step('FUND', 'sflag: ', sflag);
    this._logger.step('FUND', 'swtichFlag: ', this.swtichFlag);
    this._logger.step('FUND', 'convertType: ', this.convertType);
  }

  public showDescript() {
    const set_data = new FundInformationReserve();
    this.infomationService.show(set_data);
  }
}
