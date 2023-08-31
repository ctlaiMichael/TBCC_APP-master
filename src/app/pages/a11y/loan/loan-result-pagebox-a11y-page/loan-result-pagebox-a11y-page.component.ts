/**
 * 無障礙 借款查詢結果頁 分頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { LoanService } from '../shared/loan.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CreditInquiryService } from '@pages/credit/shared/service/credit-inquiry.service';

@Component({
  selector: 'app-loan-result-pagebox-a11y-page',
  templateUrl: './loan-result-pagebox-a11y-page.component.html'
})
export class LoanResultPageboxA11yPageComponent implements OnInit {

  /**
  * 參數處理
  */
  @Input() page: string | number = 1;
  @Input() reqObj: {}; // 查詢條件
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  showData = true;
  showError = '';
  data: any;
  info_data = {};

  loanObj: any;
  headerObj = {
    'style': 'normal_a11y',
    'showMainInfo': false,
    'leftBtnIcon': 'back',
    'rightBtnIcon': 'noshow',
    'title': '借款查詢',
    'backPath': 'a11yloansearchkey'
  };

  constructor(
    private loanService: LoanService,
    public formateService: FormateService,
    private _logger: Logger,
    private _mainService: CreditInquiryService,
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

    this._mainService.getDetailData(this.reqObj, this.page)
      .then(
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
        this._mainService.getDetailData(this.reqObj, +this.page, [], (allData.info_data.paginatedInfo.totalRowCount + 1))
          .then((allResult) => {
            this.data = allResult.data;
            this.info_data = allResult.info_data;
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
	 * 重新設定page data
	 * @param item
	 */
  onBackPageData(item) {
    let output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item
    };
    this._logger.step('loan result', 'detail back', item);
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
    this._logger.error('ContentDetailResult get error', error_obj);
    this.errorPageEmit.emit(error_obj);
  }

  // 供html呼叫，帳號格式化
  formatAccount(account: string) {
    return AccountMaskUtil.accountNoFormate(account);
  }

  // 供html呼叫，日期格式化為民國年
  formatDate(date) {
    return DateUtil.getDateString(date, true);
  }

  // 供html呼叫，格式化為dateTitle
  dateTitle(origin_date: string, prefix: string): string {
    return this.loanService.dateTitle(origin_date, prefix);
  }

  // 供html呼叫，格式化為amountTitle
  twdTitle(amount: number | string, prefix?: string) {
    return this.loanService.twdTitle(amount, prefix);
  }

}
