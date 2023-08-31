/**
 * 基金預約交易查詢-列表
 */
import { Component, OnInit, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CheckService } from '@shared/check/check.service';
import { FormateService } from '@shared/formate/formate.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { ReserveCancelPageComponent } from './pages/reserve-cancel-page.component';
// == 分頁 End == //
@Component({
  selector: 'app-fund-reserve-cancel',
  templateUrl: './fund-reserve-cancel.component.html',
  providers: []
})
export class FundReserveCancelComponent implements OnInit {
  /**
   * 參數處理
   */
  @ViewChild('pageBoxB', { read: ViewContainerRef }) pageBoxB: ViewContainerRef;
  @ViewChild('pageBoxC', { read: ViewContainerRef }) pageBoxC: ViewContainerRef;
  @ViewChild('pageBoxD', { read: ViewContainerRef }) pageBoxD: ViewContainerRef;
  @ViewChild('pageBoxA', { read: ViewContainerRef }) pageBoxA: ViewContainerRef;
  showContent = 'searchPage'; // 顯示內容頁 false: 列表頁, true 內容頁
  showListType = '';
  fullData = [];
  nowStatus: any = {};
  nowType: any = {};
  data = [];
  dataStatus = [];
  dataType = [];

  // 日期變數 start
  today = new Date();
  dd = String(this.today.getDate()).padStart(2, '0');
  mm = String(this.today.getMonth() + 1).padStart(2, '0');
  yyyy = this.today.getFullYear();
  todate = this.yyyy + '/' + this.mm + '/' + this.dd;
  todate_f2 = this.yyyy + '-' + this.mm + '-' + this.dd;

  private checkRage: any = {};
  private dateCheckList = {}; // 日期檢核設定
  startDate = {
    default: '',
    min: '',
    max: '',
    data: '',
    error: ''
  };
  endDate = {
    default: '',
    min: '',
    max: '',
    data: '',
    error: ''
  };
  showError = {
    error: false,
    msg: ''
  };

  searchBoxRule: any;

  fund_info: any = {
    custId: '',
    trnsToken: '', // 交易控制碼
    trnsDateTime: '' // 交易時間
  };

  // 日期變數 end

  content_data: any = {
    startDate: '',
    endDate: '',
    status: '',
    transType: ''
  };

  contentDetail_data: any;

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
    , private _checkService: CheckService
    , private _formateService: FormateService
  ) {
  }

  ngOnInit() {
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.navgator.push('fund');
    });
    this.pageCounter = 1;
    // this._defaultHeaderOption = this.navgator.getHeader();
    // 取下拉選單
    this.dataStatus = this.getStatusList();
    this.dataType = this.getTypeList();
    this.nowStatus = (typeof this.dataStatus[0] !== 'undefined') ? this.dataStatus[0] : {};
    this.nowType = (typeof this.dataType[0] !== 'undefined') ? this.dataType[0] : {};
    this.showListType = this.nowType.value; //決定畫面顯示(狀態)

    // 日期查詢頁面條件
    this.getSearchDate();
  }

  /**
   * Scroll Event
   * @param next_page
   */
  onScrollEvent(next_page) {
    this._logger.step('FUND', 'onScrollEvent: ', this.nowType, this.pageCounter, this.totalPages, next_page);
    this._logger.step('FUND', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);
    let now_box: ViewContainerRef;
    switch (this.nowType.value) {
      case 'B':
        now_box = this.pageBoxB;
        break;
      case 'C':
        now_box = this.pageBoxC;
        break;
      case 'D':
        now_box = this.pageBoxD;
        break;
      case 'A':
        now_box = this.pageBoxA;
        break;
    }

    this.pageCounter = next_page;
    const componentRef: any = this.paginatorCtrl.addPages(now_box, ReserveCancelPageComponent);
    componentRef.instance.transType = this.nowType.value;
    componentRef.instance.page = next_page;
    componentRef.instance.setData = this.content_data;
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
    this.showListType = this.nowType.value; //決定畫面顯示(狀態)
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
    this._logger.step('FUND', 'onBackPage[e]:', e);
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
    // this._logger.step('FUND', 'onChangeType456: ', 'onBackPage', this.pageCounter, this.totalPages, page, pageType);
    this._logger.step('FUND', 'onBackPage[tmp_data]:', tmp_data);
    if (page === 'list-item' && pageType === 'page_info') {
      // 設定頁面資料
      if (tmp_data.hasOwnProperty('page_info')
        && this.pageCounter === 1
      ) {
        // 第一頁才要設定，其他不變
        this.totalPages = tmp_data['page_info']['totalPages'];
        this._logger.step('FUND', '第一頁: ', tmp_data['info_data']['trnsToken']);
        this.fund_info.custId = tmp_data['info_data']['custId'];
        this.fund_info.trnsToken = tmp_data['info_data']['trnsToken'];
        this.fund_info.trnsDateTime = tmp_data['info_data']['trnsDateTime'];
      }
      return false;
    }
    this.onChangePage(pageType, page, tmp_data);

  }

  /**
 * 頁面切換
 * @param pageType 頁面切換判斷參數
 *        'list' : 顯示額度使用明細查詢頁(page 1)
 *        'content' : 顯示額度使用明細結果頁(page 2)
 *        'back' : 返回查詢頁
 * @param pageData 其他資料
 */
  onChangePage(pageType: string, page?: string, pageData?: any) {
    if (pageType === 'content') {
      // 內容頁
      this._logger.step('FUND', 'in content: ', pageData);
      this.showContent = 'listDetailPage';
      this.contentDetail_data = pageData;
    } else if (pageType === 'page_info') {
      // 列表頁
      this.showContent = 'listPage';
    } else if (pageType === 'back') {
      // 返回查詢頁
      if (page == 'content') {
        this.showContent = 'listPage';
      } else {
        this._logger.step('FUND', '返回查詢頁: ', this.content_data);
        this.showContent = 'searchPage';
        this.showListType = '';
      }
    } else {
      this.showContent = 'searchPage';
      this.showListType = '';
    }
    this._headerCtrl.updateOption(this._defaultHeaderOption);
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
    this._logger.step('FUND', 'get page: ', page);
    switch (page) {
      case 'list-item':
        // == 分頁返回 == //
        if (this.pageCounter === 1) {
          this._logger.step('FUND', '列表頁: ', errorObj);
          // 列表頁：首次近來錯誤推頁
          errorObj['type'] = 'dialog';
          // errorObj['type'] = 'message';
          this._handleError.handleError(errorObj);
        } else {
          // 其他分頁錯誤顯示alert錯誤訊息
          // errorObj['type'] = 'dialog';
          errorObj['type'] = 'message';
          this._handleError.handleError(errorObj);
        }
        break;
      case 'content':
        // == 內容返回(先顯示列表再顯示錯誤訊息) == //
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
        break;
    }
    this.onChangePage(pageType, page, errorObj);
  }

  public showContentList() {

    this.showContent = 'listPage';
    this._logger.step('FUND', 'Before pageData set content_data: ');
    this.content_data.status = this.nowStatus.value;
    this.content_data.transType = this.nowType.value;
    this.showListType = this.nowType.value; //決定畫面顯示(狀態)
    // this.content_data = pageData;
  }

  private getStatusList() {

    const output = [
      {
        name: '全部',
        value: 'A'
      },
      {
        name: '已處理(全部)',
        value: 'B'
      },
      {
        name: '待處理',
        value: 'C'
      },
      {
        name: '已取消',
        value: 'D'
      },
      {
        name: '已處理(成功)',
        value: 'E'
      },
      {
        name: '已處理(失敗)',
        value: 'F'
      }
    ];
    return output;
  }

  private getTypeList() {

    const output = [
      {
        name: '全部',
        value: 'A'
      },
      {
        name: '單筆申購',
        value: 'B'
      },
      {
        name: '贖回',
        value: 'C'
      },
      {
        name: '轉換',
        value: 'D'
      }
    ];
    return output;
  }

  getSearchDate() {
    /*
    * 查詢前後2個月: 2019-02-25[前2月] ~ 2019-04-25[當日] ~ 2019-06-25[後2月]
    * 1. past_date_set[strict]，baseDate以當日為基礎，查詢前2個月的日期: 2019-02-25
    * 2. set_data[future]，baseDate以前2個月的日期為基礎，查詢後4個月的日期: 2019-06-25
    */
    let past_date_set = {
      returnType: 'date',
      rangeType: 'M', // "查詢範圍類型" M OR D
      rangeNum: '2', // 查詢範圍限制
      rangeDate: '', // 比較日
      baseDate: 'today' // 系統當日
    };
    let past_date = this._checkService.getDateSet(past_date_set, 'strict');
    const basedate = this._formateService.checkField(past_date, 'SysDate');
    const mindate = this._formateService.checkField(past_date, 'minDate');
    this._logger.step('FUND', '日期檢核[past_date]: ', past_date);
    this._logger.step('FUND', '日期檢核[basedate]: ', basedate);
    this._logger.step('FUND', '日期檢核[mindate]: ', mindate);
    let set_data = {
      returnType: 'date',
      rangeType: 'M', // "查詢範圍類型" M OR D
      rangeNum: '4', // 查詢範圍限制
      rangeDate: '', // 比較日
      baseDate: mindate // 系統當日
    };
    let dateset = this._checkService.getDateSet(set_data, 'future');
    this._logger.step('FUND', 'dateset: ', dateset);
    const maxdate = this._formateService.checkField(dateset, 'maxDate');
    this._modifyDate(basedate, mindate, maxdate);
  }

  /**
 * 日期設定
 */
  private _modifyDate(basedate, mindate, maxdate) {
    let tmp_date = '';
    if (mindate !== '') {
      tmp_date = this._formateService.transDate(mindate, 'yyyy-MM-dd');
      this._logger.step('FUND', 'mindate: ', tmp_date);
      this.startDate.min = tmp_date;
      this.endDate.min = tmp_date;
      // this.startDate.default = tmp_date;
      this.startDate.data = tmp_date;
      this.content_data.startDate = tmp_date;
    }
    if (maxdate !== '') {
      tmp_date = this._formateService.transDate(maxdate, 'yyyy-MM-dd');
      this._logger.step('FUND', 'maxdate: ', tmp_date);
      this.startDate.max = tmp_date;
      this.endDate.max = tmp_date;
      // this.endDate.default = tmp_date;
      this.endDate.data = tmp_date;
      this.content_data.endDate = tmp_date;
    }
    if (basedate !== '') {
      tmp_date = this._formateService.transDate(basedate, 'yyyy-MM-dd');
      this._logger.step('FUND', 'basedate: ', tmp_date);
    }

    this._logger.step('FUND', 'DateRangeSearch', this.startDate, this.endDate);
  }
}
