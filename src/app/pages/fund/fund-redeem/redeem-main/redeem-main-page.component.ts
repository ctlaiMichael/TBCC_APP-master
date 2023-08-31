/**
 * 基金贖回
 * Page 1: 贖回條款事件 (showPage = 'agree')
 * Page 2: 贖回列表 (showPage = 'redeem-edit1')
 * Page 3: 贖回申請 (showPage = 'redeem-edit2')
 * Page 4: 贖回申請確認送出 (showPage = 'redeem-edit2') > 結果頁在裡面<app-redeem-confirm>
 */
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { FundRedeemService } from '@pages/fund/shared/service/fund-redeem.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { RedeemEdit1PageComponent } from '@pages/fund/fund-redeem/redeem-edit1/redeem-edit1-page.component';
import { FundInformationRedeemContent } from '@conf/terms/fund/fund-information-redeem.content';

@Component({
  selector: 'app-redeem-main',
  templateUrl: './redeem-main-page.component.html',
  styleUrls: [],
  providers: [PaginatorCtrlService, FundRedeemService]
})
export class RedeemMainComponent implements OnInit {
  /**
   * 參數處理
   */
  private _defaultHeaderOption: any; // header setting暫存
  showPage = 'agree';
  // == 分頁物件 == //
  dataTime: string; // 資料日期
  pageCounter = 1; // 當前頁次
  totalPages = 0; // 全部頁面
  @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
  // == 內容頁物件 == //
  goChangeTag = true;
  onRedeemData: any = []; // 將值傳給下一層(子層)
  onRedeemTrnsType: string = ''; // 傳下一層，是否轉為預約
  // ---- 下方為修改 ----
  resverFlag = false; // 是否轉預約
  trnsType = '1';
  info_data = {}; // 儲存edit1錯誤回傳重發電文之資訊
  data = []; // 儲存edit1錯誤回傳重發電文之資料

  constructor(
    private _logger: Logger
    , private navgator: NavgatorService
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private paginatorCtrl: PaginatorCtrlService
    , private confirm: ConfirmService
    , private alert: AlertService
    , private _mainService: FundRedeemService
    , private infomationService: InfomationService
  ) { }

  ngOnInit() {
    this._defaultHeaderOption = this.navgator.getHeader();
    this._mainService.removeAllCache('fund-redeem');
    this.onChangePage('agree');
  }

  /**
   * 贖回條款事件
   * app-enter-agree-content
   * @param e
   */
  onEnterAgree(e) {
    this._logger.step('FUND', 'onEnterAgree', e);
    let tmp_data: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('data')) {
        tmp_data = e.data;
      }
    }
    if (!!tmp_data) {
      // 同意
      this.onChangePage('redeem-edit1');
    } else {
      // 不同意
      this.navgator.push('fund');
    }
  }

  /**
   * 列表回傳事件 (單一筆贖回資料作業)
   * app-redeem-edit1
   * @param e
   */
  onListBackEvent(e) {
    this._logger.step('FUND', 'onListBackEvent', e);
    let page = 'list';
    let pageType = 'list';
    let tmp_data: any;
    let trnsType: string = ''; // 判斷是否轉為預約，預約2，非預約1
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
      if (e.hasOwnProperty('trnsType')) {
        trnsType = e.trnsType;
      }
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
    if (!!tmp_data) {
      this.onRedeemData = tmp_data;
      this.onRedeemTrnsType = trnsType;
    }
    this.onChangePage('redeem-edit2', tmp_data);
  }

  /**
   * Scroll Event
   * @param next_page
   */
  onScrollEvent(next_page) {
    this._logger.log('pageCounter:', this.pageCounter, 'next_page:', next_page);
    this.pageCounter = next_page;
    const componentRef: any = this.paginatorCtrl.addPages(this.pageBox, RedeemEdit1PageComponent);
    componentRef.instance.page = next_page;
    componentRef.instance.trnsType = this.trnsType;
    componentRef.instance.backPageEmit.subscribe(event => this.onListBackEvent(event));
    componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
  }

  /**
   * 贖回說明
   */
  onEnterContent() {
    const set_data = new FundInformationRedeemContent();
    this.infomationService.show(set_data);
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
    let trnsType: string = ''; // 判斷是否轉為預約，預約2，非預約1
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
      if (e.hasOwnProperty('trnsType')) {
        trnsType = e.trnsType;
      }
    }
    // this._logger.log("page:", page);
    // this._logger.log("pageType:", pageType);
    // this._logger.log("tmp_data:", tmp_data);
    // this._logger.log("trnsType:", trnsType);
    // this._logger.log('FUND', '檢查redeem-edit2(page): ', page);

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

    if (page == 'redeem-content' && pageType == 'success') {
      pageType = 'redeem-edit1';
    } else if (page === 'redeem-edit2') {
      // 書回編輯頁回到清單
      // this._logger.log('FUND', '檢查onBackPageData2 in');
      pageType = 'redeem-edit1';
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
      // page1 error回傳
      case 'list-item':
        // == 分頁返回 == //
        if (errorObj.resultCode == 'ERR1C116') {
          this._logger.log("into errorBack resultCode ERR1C116");
          this.confirm.show('現在已超過本日交易時間，或非營業日，如您欲以預約方式贖回，請點選 "繼續" !', {
            title: '提醒您',
            btnYesTitle: '繼續',
            btnNoTitle: '離開'
          }).then(
            () => {
              this.trnsType = '2'; // onchange 改變子層
            },
            () => {
              // 離開(popup)內層
              this.navgator.push('fund');
            }
          );
          return false;
        }

        if (this.pageCounter === 1) {
          // 列表頁：首次近來錯誤推頁
          if (errorObj.resultCode == 'ERR1C101') {
            // this._logger.log("resultCode ERR1C101");
            this.alert.show('親愛的客戶您好，您尚未申請網路銀行基金下單，請至營業單位臨櫃辦理網路銀行基金下單功能', {
              title: '提醒您',
              btnTitle: '我知道了',
            }).then(
              () => {
                this.navgator.push('fund');
              }
            );
          } else {
            errorObj['type'] = 'message';
            this._handleError.handleError(errorObj);
          }
        } else {
          // 其他分頁錯誤顯示alert錯誤訊息
          errorObj['type'] = 'dialog';
          this._handleError.handleError(errorObj);
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
  *        'redeem-edit1' : 贖回列表頁
  * @param pageData 其他資料
  */
  onChangePage(pageType: string, pageData?: any) {
    // logger.error('onChangePage', pageType);
    let left_event: any = () => {
      this.navgator.push('fund');
    };
    switch (pageType) {
      case 'agree': // 顯示同意條款
        this.showPage = 'agree';
        break;
      case 'redeem-edit2':
        this.showPage = 'redeem-edit2';
        break;
      case 'list':
      case 'redeem-edit1': // 贖回列表
      default:
        this._resetPage();
        this.showPage = 'redeem-edit1';
        this._headerCtrl.updateOption(this._defaultHeaderOption);
        break;
    }
    this._headerCtrl.setLeftBtnClick(left_event);
  }



  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

  private _resetPage() {
    this.pageCounter = 1;
    this.totalPages = 0;
  }


}
