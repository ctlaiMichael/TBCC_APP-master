/**
 * 變更現金收益存入帳號-列表
 */
import { Component, OnInit, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { DepositAccountPageComponent } from './pages/deposit-account-page.component';
// == 分頁 End == //
@Component({
  selector: 'app-fund-deposit-account',
  templateUrl: './fund-deposit-account.component.html',
  providers: []
})
export class FundDepositAccountComponent implements OnInit {
  /**
   * 參數處理
   */
  @ViewChild('pageBoxY', { read: ViewContainerRef }) pageBoxY: ViewContainerRef;
  @ViewChild('pageBoxN', { read: ViewContainerRef }) pageBoxN: ViewContainerRef;
  @ViewChild('pageBoxA', { read: ViewContainerRef }) pageBoxA: ViewContainerRef;
  showContent = false; // 顯示內容頁 false: 列表頁, true 內容頁
  showListType = '';
  content_data: any; // 內容頁資料
  fullData = [];
  nowType: any = {};
  showData = false;
  data = [];
  dataType = [];
  test = 'Y';

  // == 分頁物件 == //
  // @ViewChild('firstpage', { read: ViewContainerRef }) firstpage: ViewContainerRef;
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面
  private _defaultHeaderOption: any;

  constructor(
    private _logger: Logger
    , private _headerCtrl: HeaderCtrlService
    , private _uiContentService: UiContentService
    , private _handleError: HandleErrorService
    , private paginatorCtrl: PaginatorCtrlService
    , private navgator: NavgatorService
  ) { }

  ngOnInit() {
    this.pageCounter = 1;
    this._defaultHeaderOption = this.navgator.getHeader();
    // 取下拉選單
    this.dataType = this.getList();
    this.nowType = (typeof this.dataType[0] !== 'undefined') ? this.dataType[0] : {};
    this.showListType = this.nowType.value;
  }

  /**
   * Scroll Event
   * @param next_page
   */
  onScrollEvent(next_page) {
    this._logger.step('FUND', 'onScrollEvent: ', this.nowType, this.pageCounter, this.totalPages, next_page);
    this._logger.step('FUND', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);
    let now_box: any;
    switch (this.nowType.value) {
      case 'Y':
        now_box = this.pageBoxY;
        break;
      case 'N':
        now_box = this.pageBoxN;
        break;
      case 'A':
        now_box = this.pageBoxA;
        break;
    }

    this.pageCounter = next_page;
    const componentRef: any = this.paginatorCtrl.addPages(now_box, DepositAccountPageComponent);
    componentRef.instance.unitType = this.nowType.value;
    componentRef.instance.page = next_page;
    componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
  }

  /**
 * 改變select選擇時
 * @param menu
 */
  onChangeType() {
    if (typeof this.nowType !== 'object' || typeof this.nowType.value === 'undefined') {
      this._handleError.handleError({
        type: 'dialog',
        title: 'ERROR.TITLE',
        content: '請選擇庫存狀況'
      });
      return false;
    }
    this.pageCounter = 1;
    this.totalPages = 0;
    this._logger.step('FUND', 'onChangeType: ', this.nowType, this.pageCounter, this.totalPages);
    this.showListType = this.nowType.value;
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
    this._logger.step('FUND', 'onBackPage[]: ', tmp_data, page, pageType);
    if (page === 'list-item' && pageType === 'page_info') {
      // 設定頁面資料
      if (tmp_data.hasOwnProperty('page_info')
        && this.pageCounter === 1
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
    this._logger.step('FUND', 'fundDepositAccount onErrorBackEvent: ', errorObj);
    switch (page) {
      case 'list-item':
        // == 分頁返回 == //
        if (this.pageCounter === 1) {
          // 列表頁：首次近來錯誤推頁
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
          this.navgator.push('fund');
        } else {
          // 其他分頁錯誤顯示alert錯誤訊息
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
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
      this._resetPage();
    }
  }
  // 子頁回傳時，頁數需歸零，否則會繼續計算
  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }

  private getList() {

    const output = [
      {
        name: '有庫存',
        value: 'Y'
      },
      {
        name: '無庫存',
        value: 'N'
      },
      {
        name: '全部',
        value: 'A'
      }
    ];
    return output;
  }


}
