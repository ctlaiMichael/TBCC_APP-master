/**
 * 存款不足額票據-列表
 * (單頁)
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { InsufficientBillService } from '@pages/deposit/shared/service/insufficient-bill.service';

@Component({
  selector: 'app-payment-paginator',
  templateUrl: './payment-paginator.component.html',
  providers: [InsufficientBillService]
})
export class PaymentPaginator implements OnInit {
  /**
   * 參數處理
   */
  @Input() page: string|number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  data: any;

  constructor(
    private _logger: Logger
    , private _mainService: InsufficientBillService
  ) { }

  ngOnInit() {
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString());
    }
    this._mainService.getData(this.page).then(
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
    let output = {
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
    let output = {
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
    let output = {
      'page': 'list-item',
      'type': 'error',
      'data': error_obj
    };

    this.errorPageEmit.emit(output);
  }

}
