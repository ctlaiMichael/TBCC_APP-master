/**
 * 無障礙 借款查詢 分頁
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CreditInquiryService } from '@pages/credit/shared/service/credit-inquiry.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { LoanService } from '../shared/loan.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
  selector: 'app-loan-pagebox-a11y-page',
  templateUrl: './loan-pagebox-a11y-page.component.html'
})
export class LoanPageboxA11yPageComponent implements OnInit {
  /**
  * 參數處理
  */
  @Input() page: string | number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  data: any;
  account: '';

  constructor(
    private _mainService: CreditInquiryService,
    private loanService: LoanService,
  ) { }

  /**
   * 初始化
   * 1. 如外部無給page，則為1
   * 2. 取得資料
   */
  ngOnInit() {
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      // tslint:disable-next-line:radix
      this.page = parseInt(this.page.toString());
    }
    this._mainService.getData(this.page).then(
      (result) => {
        return Promise.resolve(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
        return Promise.resolve(null);
      }
    )
      .then((allData: any) => {
        if (allData) {
        this._mainService.getData(+this.page, [], {}, (allData.info_data.paginatedInfo.totalRowCount + 1))
          .then((allResult) => {
            this.data = allResult.data;
            this.onBackPageData(allResult);
          },
            (errorObj) => {
              this.onErrorBackEvent(errorObj);
            }
          );
        }
      });
  }


  /**
	 * 顯示內容頁
	 * @param item 內容頁資料
	 */
  onContentEvent(item, i) {
    let output = {
      'page': 'list-item',
      'type': 'content',
      'data': item,
      'account': item.account,
      'selectIndex': i
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
    // this._handleError.handleError(error_obj);
    // this.navgator.push('a11yhomekey'); // 無權限時回首頁
    this.errorPageEmit.emit(error_obj);
  }

  // 供html呼叫，日期格式化為民國年
  formatDate(date) {
    return DateUtil.getDateString(date, true);
  }

  dateTitle(origin_date: string, prefix: string): string {
    return this.loanService.dateTitle(origin_date, prefix);
  }
}
