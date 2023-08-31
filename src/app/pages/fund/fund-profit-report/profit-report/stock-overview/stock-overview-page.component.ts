/**
 * 基金庫存總覽
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { FundStockOverviewService } from '@pages/fund/shared/service/fundStockOverview.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CacheService } from '@core/system/cache/cache.service';


@Component({
  selector: 'app-stock-overview',
  templateUrl: './stock-overview-page.component.html',
  styleUrls: [],
  providers: [FundStockOverviewService]
})
export class StockOverviewPageComponent implements OnInit {
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  custId: string = '';
  info_data: any = {}; //fi000101存電文回傳
  data: any = []; //存fi000101電文回傳
  lookMoreOverview = false;
  moreOverview = []; //存庫存總覽(點擊該筆看更多)
  constructor(
    private _logger: Logger
    , private router: Router
    , private _stockService: FundStockOverviewService
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService
    , private _cacheService: CacheService

  ) {
  }

  ngOnInit() {
    this._initEvent();
    this._stockService.getData(this.custId).then(
      (result) => {
        this.info_data = result.info_data;
        this.data = result.data;
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
        // errorObj['type'] = 'message';
        // this._handleError.handleError(errorObj);
      });
  }

  //
  iconTable(item) {
    let page = 'goMoreOverview';
    this.onBackPageData(item, page)

    // this.lookMoreOverview = true;
    // this.moreOverview = item;
  }

  private _initEvent() {
    //設定header
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '投資損益報告'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.navgator.push('fund');
    });
  }


  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item, page?) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item
    };
    //明細頁面點查詢
    if (page === 'goMoreOverview') {
      output.page = page;
    }
    this.backPageEmit.emit(output);
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    const output = {
      'page': 'list-item',
      'type': 'error',
      'data': error_obj
    };

    this.errorPageEmit.emit(output);
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