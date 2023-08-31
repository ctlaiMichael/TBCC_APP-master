import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { FormateService } from '@shared/formate/formate.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { LoanService } from '../shared/loan.service';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
  selector: 'app-loan-result-a11y-page',
  templateUrl: './loan-result-a11y-page.component.html'
})
export class LoanResultA11yPageComponent implements OnInit {

  // 借款物件
  loanObj: any;

  // header Option
  headerObj = {
    'style': 'normal_a11y',
    'showMainInfo': false,
    'leftBtnIcon': 'back',
    'rightBtnIcon': 'noshow',
    'title': '借款查詢',
    'backPath': 'a11yloansearchkey'
  };

  // 借款資訊
  info_data: any;

  // 分頁物件
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面

  constructor(
    private navgator: NavgatorService,
    public formateService: FormateService,
    private headerCtrl: HeaderCtrlService,
    private loanService: LoanService,
    private _logger: Logger,
    private _handleError: HandleErrorService,
  ) { }

  /**
   * 初始化
   * 1. 取得從上頁傳來的loanObj
   * 2. 重設分頁資訊
   * 3. 設定返回事件
   */
  ngOnInit() {
    this.headerCtrl.setOption(this.headerObj);
    this.loanObj = this.navgator.getParams();
    this._resetPage();
    this.headerCtrl.setLeftBtnClick(() => { // 左邊button
      this.gobackPage();
    });
  }

  // 供html呼叫，帳號格式化
  formatAccount(account: string) {
    return AccountMaskUtil.accountNoFormate(account);
  }

  // 供html呼叫，日期格式化為民國年
  formatDate(date) {
    return DateUtil.getDateString(date, true);
  }

  // 供html呼叫，設置dateTitle
  dateTitle(origin_date: string, prefix: string): string {
    return this.loanService.dateTitle(origin_date, prefix);
  }


  /**
   * 返回上一頁
   */
  gobackPage() { // 左邊button
    this.loanObj.acctNo = this.loanObj.account;
    this.navgator.push('a11yloansearchkey', this.loanObj);
  }

  /**
  * 子層返回事件
  * @param e
  */
  onBackPage(e) {
    this._logger.step('loan-a11y-result', 'onBackPage', e);
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
    if (pageType === 'page_info') {
      this._logger.step('Deposit', 'set page', this.pageCounter, tmp_data);
      // 設定頁面資料
      if (this.pageCounter == 1) {
        this.info_data = tmp_data['info_data'];
        if (tmp_data.hasOwnProperty('page_info')) {
          // 第一頁才要設定，其他不變
          this.totalPages = tmp_data['page_info']['totalPages'];
        }
      }
      return false;
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
      // this.content_data = pageData;
      // this.acctObj = pageData;
      this.navgator.displayCloneBox(true); // 進入內容頁clone start
    }
  }

  /**
	 * 失敗回傳
	 * @param error_obj 失敗物件
	 */
  onErrorBackEvent(e) {
    this._logger.log('Loan', 'onErrorBackEvent', e);
    this._handleError.handleError(e);
  }

  /**
   * 重設分頁資訊
   */
  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }
}
