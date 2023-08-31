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


@Component({
  selector: 'app-stock-overview-more',
  templateUrl: './stock-overview-more-page.component.html',
  styleUrls: [],
  providers: [FundStockOverviewService]
})
export class StockOverviewMorePageComponent implements OnInit {
  @Input() inputData: any; //上一頁點選的資料 []
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  custId: string = '';
  showTWD = false;

  constructor(
    private _logger: Logger
    , private router: Router
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService

  ) {
  }

  ngOnInit() {
    this._initEvent();
    if(this.inputData.inCurrency == 'JPY'
     || this.inputData.inCurrency == 'NTD') {
       this.showTWD = true;
    } else {
      this.showTWD = false;
    }
  }


  private _initEvent() {
    this._headerCtrl.setLeftBtnClick(() => {
      let page = 'more-overview-back'
      this.onBackPageData({},page);
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
    //左側返回
    if(page === 'more-overview-back') {
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