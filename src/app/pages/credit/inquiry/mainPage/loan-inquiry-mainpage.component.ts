/**
 * 授信業務
 * 借款查詢
 */
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
// import { DayRemittancePaginator } from '../day-remittance-paginator/day-remittance-paginator.component';
import { LoanInquiryPaginatorComponent } from '../pagniator/loan-inquiry-paginator.component';

// == 分頁 End == //
import { ROUTING_PATH } from '@conf/menu/routing-path';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CacheService } from '@core/system/cache/cache.service';
@Component({
	selector: 'app-loan-inquiry',
	templateUrl: './loan-inquiry-mainpage.component.html',
	providers: []
})
export class LoanInquiryMainComponent implements OnInit {
	/**
	 * 參數處理
	 */
	@ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
	private _defaultHeaderOption: any; // header setting暫存
	showContent = false; // 顯示內容頁 false: 列表頁, true 內容頁
	content_data: any; // 內容頁資料
	searchEvent = false; // 顯示查詢列
	fullData = [];
	acctObj = {};
	dataTime = '';
	info_data: object;
	totalAmount = ''; // 借貸總額度
	showEmpty = false; // 是否顯示空資料說明

	// == 分頁物件 == //
	pageCounter: number; // 當前頁次
	totalPages: number; // 全部頁面

	constructor(
		private _logger: Logger
		, private _headerCtrl: HeaderCtrlService
		, private _uiContentService: UiContentService
		, private _handleError: HandleErrorService
		, private paginatorCtrl: PaginatorCtrlService
		, private navgator: NavgatorService
		, private _cacheService: CacheService
	) {
	}

	ngOnInit() {
		this._defaultHeaderOption = this.navgator.getHeader();
		this._cacheService.removeGroup('loan-inquiry');
		this._resetPage();
	}

	/**
	 * Scroll Event
	 * @param next_page
	 */
	onScrollEvent(next_page) {
		this._logger.step('Loan', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);
		this.pageCounter = next_page;
		let componentRef: any = this.paginatorCtrl.addPages(this.pageBox, LoanInquiryPaginatorComponent);
		componentRef.instance.page = next_page;
		componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
		componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
	}


	/**
	 * 子層返回事件
	 * @param e
	 */
	onBackPage(e) {
		this._logger.step('deposit-inquiry', 'onBackPage', e);
		let page = 'list';
		let pageType = 'list';
		let tmp_data: any;
		let info_data: object;
		if (typeof e === 'object') {
			if (e.hasOwnProperty('page')) {
				page = e.page;
			}
			if (e.hasOwnProperty('type')) {
				pageType = e.type;
			}
			if (e.hasOwnProperty('data')) {
				tmp_data = e.data;
			}
		}
		// this.account = tmp_data.account;
		if (page === 'list-item' && pageType === 'page_info') {
			// 設定頁面資料
			if (tmp_data.hasOwnProperty('page_info')
				&& this.pageCounter == 1
			) {
				// 第一頁才要設定，其他不變
				this.totalPages = tmp_data['page_info']['totalPages'];
				this.dataTime = tmp_data.dataTime;
				this.info_data = tmp_data.info_data;
				this.totalAmount = tmp_data.totalAmount;
				if (tmp_data.data.length <= 0) {
					// 無資料 (但須顯示額度資訊)
					this.showEmpty = true;
				}
			}
			return false;
		}
		this.onChangePage(pageType, tmp_data);
	}

	/**
	 * 失敗回傳
	 * @param error_obj 失敗物件
	 */
	onErrorBackEvent(e) {
		this._logger.log('Loan', 'onErrorBackEvent', e);
		let page = 'list';
		let pageType = 'list';
		let errorObj: any;
		if (typeof e === 'object') {
			if (e.hasOwnProperty('page')) {
				page = e.page;
			}
			if (e.hasOwnProperty('type')) {
				pageType = e.type;
			}
			if (e.hasOwnProperty('data')) {
				errorObj = e.data;
			}
		}

		switch (page) {
			case 'list-item':
				// == 分頁返回 == //
				if (this.pageCounter == 1) {
					// 列表頁：首次近來錯誤推頁
					errorObj['type'] = 'message';
					this._handleError.handleError(errorObj);
				} else {
					// 其他分頁錯誤顯示alert錯誤訊息
					errorObj['type'] = 'dialog';
					this._handleError.handleError(errorObj);
				}
				break;
			case 'content':
				// == 內容返回(先顯示列表再顯示錯誤訊息) == //
				this.onBackPage('list');
				errorObj['type'] = 'dialog';
				this._handleError.handleError(errorObj);
				break;
		}
	}


	/**
	* 頁面切換
	* @param pageType 頁面切換判斷參數
	*        'list' : 顯示額度使用明細查詢頁(page 1)
	*        'content' : 顯示額度使用明細結果頁(page 2)
	* @param pageData 其他資料
	*/
	onChangePage(pageType: string, pageData?: any) {
		if (pageType === 'content') {
			// 內容頁
			this.showContent = true;
			this.content_data = pageData;
			this.acctObj = pageData;
			this.navgator.displayCloneBox(true); // 進入內容頁clone start
		} else {
			// 列表頁
			this.showContent = false;
			this._headerCtrl.updateOption(this._defaultHeaderOption);
			this._resetPage();
		}
		// this._uiContentService.scrollTop();
	}


	private _resetPage() {
		this.pageCounter = 1;
		this.totalPages = 0;
	}


}
