/**
 * 變停損獲利點通知-列表
 */
import { Component, OnInit, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { IncomeNotifyPageComponent } from './pages/income-notify-page.component';
// == 分頁 End == //
@Component({
  selector: 'app-income-notify',
  templateUrl: './income-notify.component.html',
  providers: []
})
export class IncomeNotifyComponent implements OnInit {
  /**
   * 參數處理
   */
  @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
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
  }

  /**
   * Scroll Event
   * @param next_page
   */
  onScrollEvent(next_page) {
    this._logger.step('FUND', 'onScrollEvent: ', this.nowType, this.pageCounter, this.totalPages, next_page);
    this._logger.step('FUND', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);

    this.pageCounter = next_page;
    const componentRef: any = this.paginatorCtrl.addPages(this.pageBox, IncomeNotifyPageComponent);
    componentRef.instance.unitType = this.nowType.value;
    componentRef.instance.page = next_page;
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
    this._logger.step('FUND', 'IncomeNotify onErrorBackEvent: ', errorObj);
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
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
        break;
    }
  }

  // 子頁回傳時，頁數需歸零，否則會繼續計算
  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }


}
