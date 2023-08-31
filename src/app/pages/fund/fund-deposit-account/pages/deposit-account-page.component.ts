/**
 * 變更現金收益存入帳號-列表
 * (單頁)
 *     fundCode	投資代碼
    fundName	投資標的名稱
    investType	投資型態
    investDesc	投資型態說明
    iNCurrency	投資幣別
    invenAmount	庫存金額(信託本金)
    transCode	交易編號
    trustAcnt	信託帳號
    unit	單位數
    account	贖回預設存入帳號
    code	定期不定額套餐代碼
    debitStatus	扣款狀態
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FundDepositAccountService } from '@pages/fund/shared/service/fundDepositAccount.service';
@Component({
  selector: 'app-deposit-account-page',
  templateUrl: './deposit-account-page.component.html',
  providers: [FundDepositAccountService]
})
export class DepositAccountPageComponent implements OnInit {
  /**
   * 參數處理
   */
  @Input() unitType: string;
  @Input() page: string | number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  data: any;

  // 送request的物件(fi000701)

  constructor(
    private _logger: Logger
    , private _mainService: FundDepositAccountService
  ) { }

  ngOnInit() {
    if (typeof this.unitType === 'undefined') {
      this.unitType = 'Y';
    }
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 5);
    }

    const reqData = {
      unitType: this.unitType,
      filterFlag: 'N'
    };
    this._mainService.getData(reqData, this.page).then(
      (result) => {
        this.data = result.data;
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
  onBackPageData(item) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item
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

}
