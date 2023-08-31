/**
 * 台幣存款查詢: 查詢列表
 */
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { DateA11yService } from '../shared/date-a11y.service';
// == 分頁 == //
import { DepositInquiryService } from '@pages/deposit/shared/service/deposit-inquiry.service';


@Component({
  selector: 'app-taiwan-deposit-a11y-page',
  templateUrl: './taiwan-deposit-a11y-page.component.html'
})
export class TaiwanDepositA11yPageComponent implements OnInit {

  /**
   * 參數設定
   */

  // == 首頁物件 == //
  headerObj = {
    style: 'normal_a11y',
    showMainInfo: false,
    leftBtnIcon: 'back',              // 要改上一頁箭頭
    rightBtnIcon: 'noshow',
    title: '台幣存款查詢',
    backPath: 'a11yaccountkey',
  };
  islogin = false;                    // 是否登入
  showContent = false;                // 顯示內容頁 false: 列表頁, true 內容頁

  // == 內容頁物件 == //
  content_data: any;                  // 內容頁資料
  info_data = {};
  acctObj = {};
  pageCounter: number;                // 當前頁次
  totalPages: number;                 // 全部頁面
  private _defaultHeaderOption: any;  // header setting暫存

  // 該頁畫面變數宣告
  querytime: any;                    // 查詢時間
  deposit_money: any;                // 存款總金額
  demanddeposit_money: any;          // 活期存款總金額

  // 該頁報讀title 變數宣告
  myquerytime = '';
  mydeposit_money = '';
  mydemanddeposit_money = '';
  isDetail = false;

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private _handleError: HandleErrorService,
    private _logger: Logger,
    private _datea11yService: DateA11yService,
    private authService: AuthService,
    private _mainService: DepositInquiryService
  ) {
    this._headerCtrl.setOption(this.headerObj);
    this._headerCtrl.setLeftBtnClick(() => { // 左邊button
      this.gobackPage();
    });
  }

  ngOnInit() {
    if (!this.navgator.getParams().back) {
      this._mainService.removeAllCache('deposit-tw');
    }
    this._headerCtrl.setOption(this.headerObj);
    if (!this.authService.isLoggedIn()) {
      this.islogin = false;
    } else {
      this.islogin = true;
      this.pageCounter = 1;
    }
  }

  /**
   * 子層返回事件
   * @param e
   */
  onBackPage(e) {
    this._headerCtrl.setOption(this.headerObj);
    this._logger.step('NEWS', 'onBackPage', e);
    let page = 'list';
    let pageType = 'list';
    let tmp_data: any;

    if (typeof e === 'object') {
      if (e.hasOwnProperty('showContent')) {
        this.showContent = false;
      }
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('type')) {
        pageType = e.type;
      }
      if (e.hasOwnProperty('data')) {
        tmp_data = e.data;
        // 取得查詢時間
        let getTIME = this._datea11yService.getTIME(tmp_data['dataTime']);
        this.querytime = getTIME['querytime'];
        this.myquerytime = getTIME['myquerytime'];
        if (tmp_data.hasOwnProperty('acctType')) {
          if (tmp_data['acctType'] == 'FD') {
            this.isDetail = true;
          } else {
            this.isDetail = false;
          }
        }
        this.acctObj = tmp_data;
      }
    }

    if (page === 'list-item' && pageType === 'page_info') {
      // 設定頁面資料
      if (tmp_data && tmp_data.hasOwnProperty('page_info') && this.pageCounter == 1) {
        // 第一頁才要設定，其他不變
        this.totalPages = tmp_data['page_info']['totalPages'];
        this.info_data = tmp_data['info_data'];
        this.deposit_money = this.info_data['totalAcctAmt'];
        this.demanddeposit_money = this.info_data['totlSaveAcctAmt'];
        this.mydeposit_money = "存款總金額 新台幣" + this.deposit_money + "元";
        this.mydemanddeposit_money = "活期存款總金額 新台幣" + this.demanddeposit_money + "元";
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
    this._logger.log('NEWS', 'onErrorBackEvent', e);
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
      this.showContent = true;
      this.acctObj = pageData;
      this.content_data = pageData;
    } else {
      // 列表頁
      this.showContent = false;
      this._headerCtrl.updateOption(this._defaultHeaderOption);
      this._resetPage();
    }
    // this._uiContentService.scrollTop();
  }

  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }

  //  反回上一頁
  gobackPage() { // 左邊button
    this.navgator.push('a11yaccountkey');
  }
}
