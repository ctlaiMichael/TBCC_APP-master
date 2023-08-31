
/**
 * 當日匯入匯款內容頁
 */
import { Component, OnInit, OnChanges, ViewChild, ViewContainerRef, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';

// == 分頁 End == //
import { ROUTING_PATH } from '@conf/menu/routing-path';
import { DayRemittanceService } from '@pages/deposit/shared/service/day-remittance.service';
import { DayRemitDetailPaginatorComponent } from './day-remit-detail-paginator/day-remit-detail-paginator.component';
@Component({
	selector: 'app-day-remit-detail-mainpage',
	templateUrl: './day-remit-detail-mainpage.component.html',
	providers: [DayRemittanceService]
})
export class DayRemitDetailMainPageComponent implements OnChanges {
	/**
	 * 參數處理
	 */
	@ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
	showContent = false; // 顯示內容頁 false: 列表頁, true 內容頁
	content_data: any; // 內容頁資料
	fullData = [];

	@Input() acctObj: object;
	@Input() setData;
	dataTime = '';

	// == 分頁物件 == //
	pageCounter: number; // 當前頁次
	totalPages: number; // 全部頁面

	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
	data: any;

	constructor(
		private _logger: Logger
		, private _headerCtrl: HeaderCtrlService
		, private _uiContentService: UiContentService
		, private _handleError: HandleErrorService
		, private paginatorCtrl: PaginatorCtrlService
	) {
		// --- 頁面設定 ---- //
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'back'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			let output = {
				'page': 'content',
				'pageType': 'back_to_parent',
			};

			this.backPageEmit.emit(output);
		});
	}

	ngOnChanges() {
		this.pageCounter = 1;
	}

	/**
	 * Scroll Event
	 * @param next_page
	 */
	onScrollEvent(next_page) {
		this.pageCounter = next_page;
		let componentRef: any = this.paginatorCtrl.addPages(this.pageBox, DayRemitDetailPaginatorComponent);
		componentRef.instance.page = next_page;
		componentRef.instance.acctObj = this.acctObj;
		componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
	}


	/**
	 * 子層返回事件
	 * @param e
	 */
	onBackPage(e) {
		let page = 'list';
		let pageType = 'list';
		let tmp_data: any;
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
		if (page === 'list-item' && pageType === 'page_info') {
			// 設定頁面資料
			if (tmp_data.hasOwnProperty('page_info')
				&& this.pageCounter == 1
			) {
				// 第一頁才要設定，其他不變
				this.totalPages = tmp_data['page_info']['totalPages'];

				this.dataTime = tmp_data.dataTime;

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
		this._logger.log('NEWS', 'onErrorBackEvent', e);
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
		} else {
			// 列表頁
			this.showContent = false;
			// this._headerCtrl.setOption(ROUTING_PATH['deposit']);
			this._headerCtrl.setOption(ROUTING_PATH['deposit']);
			// this._headerCtrl.setLeftBtnClick('back');
		}
		this._uiContentService.scrollTop();

	}


}
