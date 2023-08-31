/**
 * 基金庫存明細
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundStockDetailService } from '@pages/fund/shared/service/fundStockDetail.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail-page.component.html',
  styleUrls: [],
  providers: [FundStockDetailService]
})
export class StockDetailPageComponent implements OnInit {
@Input() page: string | number = 1;
@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  custId :string ='';
  info_data :any = {}; //fi000102存電文回傳
  data :any = []; //存fi000102電文回傳
  lookMoreOverview = false;
  moreOverview = []; //存庫存總覽(點擊該筆看更多)
  showTWD = false; //是否顯示小數點? 台幣日幣不顯示
  constructor(
    private _logger: Logger
    , private router: Router
    ,private confirm: ConfirmService
    ,private _handleError: HandleErrorService
    ,private navgator: NavgatorService
    ,private _mainService: FundStockDetailService
    , private _headerCtrl: HeaderCtrlService

  ) {
  }

  ngOnInit() {
    this._initEvent();
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 10);
    }
    this._mainService.getData({}, this.page, [], { reget: false }).then(
      (result) => {
        this.info_data = result.info_data;
        this.data = result.data;
        this.onBackPageData(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );
  }

  //庫存明細點擊查詢
  onQuery(item) {
    let page: string = 'stock-detail-query';
    this.onBackPageData(item,page);
  }

  /**
   * 顯示內容頁
   * @param item 內容頁資料
   */
  onContentEvent(item) {
    const output = {
      'page': 'list-item',
      'type': 'content',
      'data': item
    };

    this.backPageEmit.emit(output);
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item,page?) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item
    };
    //明細頁面點查詢
    if(page === 'stock-detail-query') {
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


  private _initEvent() {
    this._headerCtrl.setLeftBtnClick(() => {
      this.navgator.push('fund');
    });
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