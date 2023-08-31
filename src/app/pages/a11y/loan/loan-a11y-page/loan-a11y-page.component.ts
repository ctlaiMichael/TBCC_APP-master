import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CacheService } from '@core/system/cache/cache.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { LoanService } from '../shared/loan.service';

@Component({
  selector: 'app-loan-a11y-page',
  templateUrl: './loan-a11y-page.component.html',
})
export class LoanA11yPageComponent implements OnInit {

  /**
  * 參數處理
  */

  loanObj = {
    requestTime: '', // 查詢時間
    totalAmount: '', // 借款總額度
    detail: {
      expirDate: '', // 到期日
      acctNo: '', // 帳號
      balence: '', // 現欠餘額  注意喔是 bal e nce
      lastInterRecDate: '', // 上次利息收訖日
      rate: '' // 目前利率
    },
    selectLoan: -1 // 欲搜尋之借款查詢帳號
  };

  headerObj = {
    'style': 'normal_a11y',
    'showMainInfo': false,
    'leftBtnIcon': 'back',
    'rightBtnIcon': 'noshow',
    'title': '借款查詢',
    'backPath': 'a11yaccountkey'
  };

  searchTimeTitle = ''; // 查詢時間 title

  private _defaultHeaderOption: any; // header setting暫存
  content_data: any; // 內容頁資料
  searchEvent = false; // 顯示查詢列
  fullData = [];
  acctObj = {};
  dataTime = '';
  info_data: object;
  totalAmount = ''; // 借貸總額度
  showEmpty = false; // 是否顯示空資料說明

  // == 分頁物件 == //
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面

  constructor(
    private _logger: Logger,
    private navigator: NavgatorService,
    private headerCtrl: HeaderCtrlService,
    public formateService: FormateService,
    private loanService: LoanService,
    private _handleError: HandleErrorService,
    private _cacheService: CacheService,
  ) { }

  ngOnInit() {
    this.headerCtrl.setOption(this.headerObj);
    if (!this.navigator.getParams().back) {
      this._cacheService.removeGroup('loan-inquiry');
    }
    this._resetPage();
  }

  dateTitle(origin_date: string, prefix: string): string {
    if (origin_date.length == 0) {
      return '';
    }
    return this.loanService.dateTitle(origin_date, prefix);
  }

  timeTitle(time: string): string {
    if (time.length == 0) {
      return '';
    }
    return this.loanService.timeTitle(time);
  }

  /**
	 * 子層返回事件
	 * @param e
	 */
  onBackPage(e) {
    this._logger.step('loan-a11y', 'onBackPage', e);
    let page = 'list';
    let pageType = 'list';
    let tmp_data: any;
    let info_data: object;
    let goDetail = false;
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
    // this.account = tmp_data.account;
    if (page === 'list-item' && pageType === 'page_info') {
      let args = { 'formate': 'yyy/MM/dd HH:mm:ss', 'chinaYear': true };
      this.dataTime = DateUtil.transDate(tmp_data.dataTime, args);
      this.searchTimeTitle = this.dateTitle(this.dataTime.split(' ')[0], '查詢時間') +
        this.timeTitle(this.dataTime.split(' ')[1]);
      // 設定頁面資料
      if (tmp_data.hasOwnProperty('page_info')
        && this.pageCounter == 1
      ) {
        // 第一頁才要設定，其他不變
        this.totalPages = tmp_data['page_info']['totalPages'];
        this.info_data = tmp_data.info_data;
        this.totalAmount = tmp_data.totalAmount;
      }
      return false;
    } else {
      this.loanObj.selectLoan = e.selectIndex;
      this.loanObj.totalAmount = this.totalAmount;
      this.loanObj.requestTime = this.dataTime;
      this.loanObj.detail = e.data;
      goDetail = true;
    }
    if (!goDetail) {
      this.onChangePage(pageType, tmp_data);
    } else {
      this.navigator.push('a11yloansearchkey', this.loanObj.detail);
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
      this.acctObj = pageData;
      this.navigator.displayCloneBox(true); // 進入內容頁clone start
    }
  }

  /**
	 * 失敗回傳
	 * @param error_obj 失敗物件
	 */
  onErrorBackEvent(e) {
    this._handleError.handleError(e);
    this.navigator.push('a11yhomekey'); // 無權限時回首頁
  }

  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }
}
