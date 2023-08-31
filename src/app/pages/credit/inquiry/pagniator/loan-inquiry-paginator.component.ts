/**
 * 授信-當日匯入款項-列表
 * (單頁)
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CreditInquiryService } from '@pages/credit/shared/service/credit-inquiry.service';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
	selector: 'app-loan-inquiry-paginator',
	templateUrl: './loan-inquiry-paginator.component.html',
	providers: [CreditInquiryService]
})
export class LoanInquiryPaginatorComponent implements OnInit {
	/**
	 * 參數處理
	 */
	@Input() page: string | number = 1;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
	data: any;
	account: '';
	constructor(
		private _logger: Logger
		, private navgator: NavgatorService
		, private _mainService: CreditInquiryService
	) { }

	ngOnInit() {

		if (typeof this.page === 'undefined') {
			this.page = 1;
		} else {
			// tslint:disable-next-line:radix
			this.page = parseInt(this.page.toString());
		}
		this._mainService.getData(this.page).then(
			(result) => {
				this.data = result.data;
				if (this.page === 1) {
					this.navgator.pageInitEnd(); // 取得資料後顯示頁面
				}
				this.onBackPageData(result);
			},
			(errorObj) => {
				if (this.page === 1) {
					this.navgator.pageInitEnd(); // 取得資料後顯示頁面
				}
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
			'data': item,
			'account': item.account
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

