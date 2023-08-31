/**
 * 當日匯入款項-列表
 * (單頁)
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { DayRemittanceService } from '@pages/deposit/shared/service/day-remittance.service';

@Component({
  selector: 'app-day-remit-list-paginator',
  templateUrl: './day-remit-list-paginator.component.html',
  providers: [DayRemittanceService]
})
export class DayRemitListPaginatorComponent implements OnInit {
  /**
   * 參數處理
   */
    @Input() page: string | number = 1;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    data: any;

  constructor(
    private _logger: Logger
    , private _mainService: DayRemittanceService
  ) { }

  ngOnInit() {
      if (typeof this.page === 'undefined') {
          this.page = 1;
      } else {
          // tslint:disable-next-line:radix
          this.page = parseInt(this.page.toString());
      }
      this._mainService.getListData(this.page).then(
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

