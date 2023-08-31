/**
 * 外匯存款查詢
 */
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// == 分頁 == //
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { ForeignListComponent } from './list/foreign-list-page.component';
import { DepositInquiryService } from '@pages/deposit/shared/service/deposit-inquiry.service';


@Component({
    selector: 'app-foreign-deposit-page',
    templateUrl: './foreign-deposit-page.component.html',
    styleUrls: [],
    providers: [DepositInquiryService]
})
export class ForeignDepositPageComponent implements OnInit {
    /**
     * 參數處理
     */
    private _defaultHeaderOption: any; // header setting暫存
    showContent = false; // 顯示內容頁 false: 列表頁, true 內容頁
    accountData: any = {};
    showCurrency = ''; // 若只顯示為TWD(無小數)，請加上'TWD'
    // == 分頁物件 == //
    dataTime: string; // 資料日期
    pageCounter = 1; // 當前頁次
    totalPages = 0; // 全部頁面
    @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
    // == 內容頁物件 == //
    showDemandDeposit = true;
    acctObj = {};
    content_data: any; // 內容頁資料

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private paginatorCtrl: PaginatorCtrlService
        , private navgator: NavgatorService
        , private _mainService: DepositInquiryService
    ) { }

    ngOnInit() {
        this._defaultHeaderOption = this.navgator.getHeader();
        this._mainService.removeAllCache('deposit-forex');
        this._resetPage();
    }

    /**
     * Scroll Event
     * @param next_page
     */
    onScrollEvent(next_page) {
        this._logger.step('Deposit', 'onScrollEvent'
            , this.pageCounter, 'totalPages'
            , this.totalPages
            , 'next_page', next_page
            , 'pagebox', this.pageBox);
        this.pageCounter = next_page;
        let componentRef: any = this.paginatorCtrl.addPages(this.pageBox, ForeignListComponent);
        componentRef.instance.page = next_page;
        componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
        componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
    }


    /**
     * 子層返回事件
     * @param e
     */
    onBackPage(e) {
        this._logger.step('Deposit', 'onBackPage', e);
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
            if (this.pageCounter == 1) {
                this.accountData = tmp_data['info_data']; // 其他資料
                if (tmp_data.hasOwnProperty('dataTime')) {
                    this.dataTime = tmp_data['dataTime'];
                }
                if (tmp_data.hasOwnProperty('page_info')) {
                    // 第一頁才要設定，其他不變
                    this.totalPages = tmp_data['page_info']['totalPages'];
                }
            }
            return false;
        } else {
            this.onChangePage(pageType, tmp_data);
        }

    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(e) {
        this._logger.log('Deposit', 'onErrorBackEvent', e);
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
            this.acctObj = pageData;
            this.content_data = pageData;
            this.navgator.displayCloneBox(true); // 進入內容頁clone start
            this.showDemandDeposit = pageData['showDemandDeposit'];
        } else {
            // 列表頁
            this.showContent = false;
            this._headerCtrl.updateOption(this._defaultHeaderOption);
            this._resetPage();
        }

    }

    private _resetPage() {
        this.pageCounter = 1;
        this.totalPages = 0;
        this.dataTime = '';
    }





}
