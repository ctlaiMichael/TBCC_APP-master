/**
 * 基金庫存(總覽、明細)主Tag
 */
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { StockDetailPageComponent } from '../stock-detail/stock-detail-page.component';
import { CacheService } from '@core/system/cache/cache.service';


@Component({
  selector: 'app-fund-report',
  templateUrl: './fund-report-page.component.html',
  styleUrls: [],
  providers: [PaginatorCtrlService]
})
export class FundReportPageComponent implements OnInit {
  @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
  goChangeTag = true;
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面
  goQuery = false; //控制是否進第二層
  moreOverview = false; //基金庫存總覽(查看更多)
  onQueryData: any = []; //將值傳給下一層(子層)

  constructor(
    private _logger: Logger
    , private router: Router
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private paginatorCtrl: PaginatorCtrlService
    , private _cacheService: CacheService

  ) { }

  ngOnInit() {
    this.pageCounter = 1;
    this._cacheService.removeGroup('fund-stock-list');

  }

  onOverview() {
    this.goChangeTag = true;
  }

  onDetail() {
    this.goChangeTag = false;
  }



  /**
 * Scroll Event
 * @param next_page
 */
  onScrollEvent(next_page) {
    // console.error('onscrollEvent',next_page,this.pageBox);
    this.pageCounter = next_page;
    const componentRef: any = this.paginatorCtrl.addPages(this.pageBox, StockDetailPageComponent);
    componentRef.instance.page = next_page;
    componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
    componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
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
    if (page === 'list-item') {
    }
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
    if (page === 'stock-detail-query') {
      if (tmp_data !== '') {
        this.onQueryData = tmp_data;
      }
      this.goQuery = true;
      this.moreOverview = false;
    }
    if (page === 'goMoreOverview') {
      if (tmp_data !== '') {
        this.onQueryData = tmp_data;
      }
      this.moreOverview = true;
      this.goQuery = false;
    }
    if (page === 'more-overview-back') {
      this.moreOverview = false;
      this.goQuery = false;
    }
    if (page === 'detail-back') {
      this.moreOverview = false;
      this.goQuery = false;
    }

    this.onChangePage(pageType, tmp_data);
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
      //   this.showContent = true;
      //   this.content_data = pageData;
    } else {
      this._resetPage();
      //   // 列表頁
      //   this.showContent = false;
      //   this._headerCtrl.updateOption(this._defaultHeaderOption);
    }
  }


  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
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
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
          // this.navgator.push('fund');
        } else {
          // 其他分頁錯誤顯示alert錯誤訊息
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
          // this.navgator.push('fund');
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
   * go
   *
   */

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

}