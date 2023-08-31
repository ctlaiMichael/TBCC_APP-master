/**
 * 定期不定額查詢異動-列表
 */
import { Component, OnInit, ViewChild, HostListener, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { PayChangePageComponent } from './pages/pay-change-page.component';
import { AuthService } from '@core/auth/auth.service';
import { FundDeleteService } from '@pages/fund/shared/service/fund-delete.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { AlertService } from '@shared/popup/alert/alert.service';
// == 分頁 End == //
@Component({
  selector: 'app-fund-pay-change',
  templateUrl: './fund-pay-change.component.html',
  providers: []
})
export class FundPayChangeComponent implements OnInit {
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
  deleteFundList = [];
  count:number = 0;

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
    , public authService: AuthService
    , private _fundDeleteService: FundDeleteService
    , private router: Router
    , private alert: AlertService
  ) { }

  ngOnInit() {
    this.pageCounter = 1;
    this._defaultHeaderOption = this.navgator.getHeader();
    // 取下拉選單
    this.dataType = this.getList();
    this.nowType = (typeof this.dataType[0] !== 'undefined') ? this.dataType[0] : {};
    this.showListType = this.nowType.value;
    this._logger.step('FUND', 'onScrollEvent init: ', this.pageCounter, this.totalPages);
  }

  /**
   * Scroll Event
   * @param next_page
   */
  onScrollEvent(next_page) {
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
    const componentRef: any = this.paginatorCtrl.addPages(now_box, PayChangePageComponent);
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
    this._logger.step('FUND', '參照(A)tmp_data / page / pageType: ', tmp_data, page, pageType);
    if (page === 'list-item' && pageType === 'page_info') {
      // 設定頁面資料
      if (tmp_data.hasOwnProperty('page_info')
        && this.pageCounter === 1
      ) {
        // 第一頁才要設定，其他不變
        this.totalPages = tmp_data['page_info']['totalPages'];
      }
      this._logger.step('FUND', '參照(A)pageCounter / totalPages: ', this.pageCounter, this.totalPages);
      return false;
    }

    if (page === 'list-item' && pageType === 'delete_item') {
      this.deleteFundList[0] = tmp_data;
      this._logger.step('FUND', 'need to Remeber delete deleteFundList: ', this.deleteFundList[0]);
      //目前只能刪一筆，
      this._logger.log("deleteFundList[0]:", this.deleteFundList[0]);
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
    this._logger.log("pageType:", pageType);
    if (pageType === 'content') {
      // 內容頁
      this._logger.step('FUND', 'in content');
      this.showContent = true;
      this.content_data = pageData;
    } else if (pageType == 'delete_item') {
      this.showContent = false;
      this._headerCtrl.updateOption(this._defaultHeaderOption);
      this._resetPage();
      //呼叫刪除api
      this.sendDelete();
    } else if (pageType == 'delete_success') {
      this._logger.log("into delete back");
      this.showContent = false;
      this._headerCtrl.updateOption(this._defaultHeaderOption);

      this.nowType.value = 'A';
      this.showListType = this.nowType.value;
      this._resetPage();
      this._logger.log("count:",this.count);
      this._logger.log("showListType:", this.showListType);
    }
    else {
      // 列表頁
      this._logger.log("pageType else");
      this.showContent = false;
      this._headerCtrl.updateOption(this._defaultHeaderOption);
      this._resetPage();
    }
  }

  deleteFund() {
    // 目前暫時只能刪除一筆
    // 20190510 待改，已列出問題單，目前無法多選刪除項目，先以當前勾選的項目做刪除，待合庫確認需求時，再將選取的項目放到陣列
    if (this.deleteFundList.length > 1) {
      this._handleError.handleError({
        type: 'dialog',
        title: 'POPUP.NOTICE.TITLE',
        content: '只能選擇一項基金刪除。'
      });
    }
    this.sendDelete();
    this._logger.step('FUND', 'this.deleteFundList.length: ', this.deleteFundList);
  }

  //刪除FI000711
  private sendDelete() {
    const userData = this.authService.getUserInfo();
    let deletObj = {
      custId: userData.custId,
      transCode: this.deleteFundList[0]
    };
    this._logger.step('FUND', 'start delete Fund: ', deletObj);
    this._logger.log("deletObj:", deletObj);
    this._fundDeleteService.getData(deletObj).then(
      (success) => {
        this._logger.step('FUND', '_fundDeleteService: ', success);
        this.alert.show('基金刪除成功', {
          title: '提醒您',
          btnTitle: '確認',
        }).then(
          () => {
            // 選擇取消
            this._resetPage();
            //重發一次701
            // location.reload();
          }
        );
      },
      (error_obj) => {
        this._handleError.handleError(error_obj);
      }
    );
  }

  // 子頁回傳時，頁數需歸零，否則會繼續計算
  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
    this.count++;
    this._logger.log("count:",this.count);
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

  public backMenuPage() {
    this.navgator.push('fund');
  }
}
