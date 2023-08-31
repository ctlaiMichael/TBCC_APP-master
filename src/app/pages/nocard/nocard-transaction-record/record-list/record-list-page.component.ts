import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { RecordListPaginatorComponent } from './record-list-paginator/record-list-paginator.component';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list-page.component.html',
  styleUrls: []
})
export class RecordListPageComponent implements OnInit {
  // ===== Component Properties =====
  showListPage = true;  // 是否顯示交易紀錄清單, true:顯示預約交易清單, false:不顯示預約交易清單
  showDetlPage = false; // 是否顯示交易明細頁,   true:顯示交易明細頁,  false:不顯示交易明細頁
  showRsltPage = false; // 是否顯示結果頁,      true:顯示結果頁,      false:不顯示結果頁
  queryTime: string;    // 查詢時間
  pageCounter = 1;      // 目前頁數
  totalPages = 0;       // 總分頁數
  detailObj: any;       // 交易明細物件
  trnsTime: string;     // 取消預約時間

  // 預設功能 Title
  headerObj = {
    title: 'FUNC_SUB.CARDLESS.SEARCH_TRANS',
    leftBtnIcon: 'back'
  };

  @ViewChild('pageBox', {read: ViewContainerRef}) pageBox: ViewContainerRef;

  constructor(
    private _logger: Logger,
    private _headerCtrl: HeaderCtrlService,
    private _handleError: HandleErrorService,
    private _paginatorCtrl: PaginatorCtrlService
  ) {}

  ngOnInit() {
    // 初始功能 Title
    this._headerCtrl.setOption(this.headerObj);
    // 初始分頁參數
    this._resetPage();
  }

  /**
   * 頁面轉導判斷處理
   * @param {any} event
   * @returns
   * @memberof RecordListPageComponent
   */
  onBackPage(event) {
    let page = 'list';
    let pageType = 'list';
    let tmpData: any;

    if (typeof event === 'object') {
      if (event.hasOwnProperty('page')) {
        page = event.page;
      }
      if (event.hasOwnProperty('type')) {
        pageType = event.type;
      }
      if (event.hasOwnProperty('data')) {
        tmpData = event.data;
      }
    }

    if (page === 'list-item' && pageType === 'page_info') {
      // 設定頁面資料
      if (tmpData.hasOwnProperty('page_info') && this.pageCounter == 1) {
        // 第一頁才要設定，其他不變
        this.totalPages = tmpData['page_info']['totalPages'];
        this.queryTime = tmpData['dataTime'];
      }

      return false;

    } else {
        this.onChangePage(pageType, tmpData);
    }
  }

  /**
   * 異常處理
   * @param event
   * @memberof RecordListPageComponent
   */
  onErrorBackEvent(event) {
    this._handleError.handleError(event);
  }

  /**
   * 頁面切換
   * @param {string} pageType
   * @param {any} pageData
   * @memberof RecordListPageComponent
   */
  onChangePage(pageType: string, pageData: any) {
    if (pageType === 'detail') {
      // 明細頁
      this.detailObj = pageData;
      this.headerObj.title = 'FUNC_SUB.CARDLESS.SEARCH_DETAIL';
      this._headerCtrl.setOption(this.headerObj);

      // 畫面顯示控制
      this.showListPage = false;
      this.showDetlPage = true;
      this.showRsltPage = false;

    } else if (pageType === 'result') {
      // 結果頁
      this.trnsTime = pageData;
      this.headerObj.title = 'FUNC_SUB.CARDLESS.SEARCH_CANCEL';
      this.headerObj.leftBtnIcon = 'menu';
      // 畫面顯示控制
      this.showListPage = false;
      this.showDetlPage = false;
      this.showRsltPage = true;

    } else {
      // 清單頁
      this._resetPage();
      this.headerObj.title = 'FUNC_SUB.CARDLESS.SEARCH_TRANS';
      this._headerCtrl.updateOption(this.headerObj);

      // 畫面顯示控制
      this.showListPage = true;
      this.showDetlPage = false;
      this.showRsltPage = false;
    }
  }

  /**
   * 背景取得預約記錄清單
   * @param nextPage
   */
  onScrollEvent(nextPage) {
    this.pageCounter = nextPage;
    let componentRef: any = this._paginatorCtrl.addPages(this.pageBox, RecordListPaginatorComponent);
    componentRef.instance.page = nextPage;
    componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
    componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
  }

  /**
   * 初始化 paginator
   * @private
   * @memberof RecordListPageComponent
   */
  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
    this.queryTime = '';
  }
}
