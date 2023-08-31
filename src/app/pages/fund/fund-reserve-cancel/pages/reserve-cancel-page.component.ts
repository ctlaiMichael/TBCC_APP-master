/**
 * 基金預約交易查詢
 * (單頁)
 *
 *  enrollDate	交易日期
    effectDate	生效日期
    reserveTransCode	預約編號
    transType	交易項目
    transTypeDesc 交易項目說明
    fundCode	投資代碼
    fundName	投資標的名稱
    fundRisk	基金風險屬性
    investDesc	投資型態說明
    transCode 交易編號
    currency  投資幣別
    iNCurrency	基金幣別
    purchAmnt	申購/轉換/贖回金額
    serviceFee	手續費
    payAccount	扣款帳號
    redeemAccount 入帳帳號
    lastChangeDate 處理日期
    status 處理結果(交易狀況)
    statusDesc 處理結果說明
    inFundCode 轉入基金代碼
    inFundName 轉入基金名稱
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { Logger } from '@core/system/logger/logger.service';
import { ReserveCancelListService } from '@pages/fund/shared/service/reserveCancelList.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
  selector: 'app-reserve-cancel-page',
  templateUrl: './reserve-cancel-page.component.html',
  providers: [ReserveCancelListService]
})
export class ReserveCancelPageComponent implements OnInit {
  /**
   * 參數處理
   */
  @Input() setData: any;
  @Input() page: string | number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  reqData:any;
  sData = {
    data: [],
    info_data: {},
    page_info: {}
  };
  searchStartDate = '';
  searchEndDate = '';
  statusRed = 'N';
  private _defaultHeaderOption: any;

  // 送request的物件(fi000601)

  constructor(
    private _logger: Logger
    , private _mainService: ReserveCancelListService
    , private _headerCtrl: HeaderCtrlService
    , private navgator: NavgatorService
  ) {
  }

  ngOnInit() {
    // --- 頁面設定 ---- //
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.onLeftBackPageData();
    });
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 5);
    }
    this._defaultHeaderOption = this.navgator.getHeader();
    this._logger.step('FUND', 'get setData: ', this.setData);
    if (typeof this.setData === 'undefined') {
      this.setData = {
        startDate: '',
        endDate: '',
        status: 'A',
        transType: 'A'
      };
    }
    this.reqData = this.setData;
    this._logger.log("601 reqData:",this.reqData);

    this._mainService.getData(this.reqData, this.page).then(
      (result) => {
        this._logger.step('FUND', 'get result: ', result);
        this.sData = result;
        let checkStatus = this.setData.status;

        this.searchStartDate = this.sData['startDate'];
        this.searchEndDate = this.sData['endDate'];
        this.onBackPageData(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );
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
  onBackPageData(item?: any) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item
    };

    this.backPageEmit.emit(output);
  }

  onLeftBackPageData() {
    const output = {
      'page': 'list-item',
      'type': 'back',
      'data': ''
    };

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
   * 重新設定page data
   * @param item
   */
  // onBackBtnPageData(item?: any) {
  //   const output = {
  //     'page': 'content',
  //     'type': 'back',
  //     'data': item
  //   };
  //   this.backPageEmit.emit(output);

  // }

}
