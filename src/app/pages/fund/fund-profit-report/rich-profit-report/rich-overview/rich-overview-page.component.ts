/**
 * 智富庫存總覽
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundRichOverviewService } from '@pages/fund/shared/service/fundRichOverview.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
  selector: 'app-rich-overview',
  templateUrl: './rich-overview-page.component.html',
  styleUrls: [],
  providers: [FundRichOverviewService]
})
export class RichOverviewPageComponent implements OnInit {
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  info_data: any = {}; // fi000303存電文回傳
  data: any = []; // 存fi000303電文回傳
  lookMoreOverview = false;
  moreOverview = []; // 存庫存總覽(點擊該筆看更多)
  showData = false;
  showError = '';
  moreBackFlag = false; //返回flag
  constructor(
    private _logger: Logger
    , private router: Router
    , private _stockService: FundRichOverviewService
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService

  ) {
  }

  ngOnInit() {
    this.onChangePage('list');
    this._stockService.getData({}).then(
      (result) => {
        this.info_data = result.info_data;
        this.data = result.data;
        this.showData = true;
      },
      (errorObj) => {
        errorObj['type'] = 'dialog';
        if (!!errorObj['content']) {
          this.showError = errorObj['content'];
        } else if (!!errorObj['msg']) {
          this.showError = errorObj['msg'];
        }
        this._handleError.handleError(errorObj);
      });
  }

  // 查詢
  iconTable(item) {
    this.moreOverview = item;
    // this.onChangePage('content');
    // 內容頁
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': 'FUNC_SUB.FUND.SMART_REPORT_SUM' // 智富庫存總覽
    });
    this.lookMoreOverview = true;
    // 左側返回
    this._headerCtrl.setLeftBtnClick(() => {
      this.lookMoreOverview = false;
      this.moreBackFlag = true; //返回開啟
      this.onChangePage('content');
    });
  }

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------


  /**
 * 頁面切換
 * @param pageType 頁面切換判斷參數
 *        'list' : 顯示額度使用明細查詢頁(page 1)
 *        'content' : 顯示額度使用明細結果頁(page 2)
 * @param pageData 其他資料
 */
  onChangePage(pageType: string, pageData?: any) {
    if (pageType === 'content') {
      this.backMore();
    } else {
      // 列表頁
      this.lookMoreOverview = false;
      this._headerCtrl.updateOption({
        'leftBtnIcon': 'back',
        'title': 'FUNC_SUB.FUND.SMART_REPORT' // 智富投資損益報告
      });
    }
  }
  backMore() {
    if (this.moreBackFlag == true) {
      this._headerCtrl.updateOption({
        'leftBtnIcon': 'back',
        'title': 'FUNC_SUB.FUND.SMART_REPORT' // 智富投資損益報告
      });
      this._headerCtrl.setLeftBtnClick(() => {
        this.onBackPageData({});
      });
    }
  }

  /**
 * 返回上一層
 * @param item
 */
  onBackPageData(item?: any) {
    //返回最新消息選單
    let output = {
      'page': 'overview',
      'type': 'overview_back',
      'data': item
    };
    if (item.hasOwnProperty('page')) {
      output.page = item.page;
    }
    if (item.hasOwnProperty('type')) {
      output.type = item.type;
    }
    if (item.hasOwnProperty('data')) {
      output.data = item.data;
    }
    this.backPageEmit.emit(output);
  }


}
