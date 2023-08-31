/**
 * 已實現損益查詢
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { FormateService } from '@shared/formate/formate.service';
import { FundHasRealizeService } from '@pages/fund/shared/service/fundHasRealize.service';
import { HasRealizeDetailPageComponent } from '../has-realize-detail/has-realize-detail-page.component';
import { CacheService } from '@core/system/cache/cache.service';

@Component({
    selector: 'app-has-realize-tag',
    templateUrl: './has-realize-tag-page.component.html',
    styleUrls: [],
    providers: [FundHasRealizeService]
})
export class HasRealizeTagPageComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() inputType: any; //接收type
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showNewType = false; // 新舊制轉換
    bookmarkData = []; // 頁籤設定
    nowPageType = ''; // 當前頁面名稱
    showSearchBox = false; // 顯示查詢box
    searchInfoData: Array<any>;
    searchBoxRule: any;
    dataTime: string; // 查詢時間
    itemData: any; // 帳戶彙總
    checkTypeKey = '12M';
    goQuery = false; // flag將明細(單筆)值，帶入查詢頁
    // 查詢條件
    detailReqObj = {
        id: '',
        show: false,
        type: '',
        startDate: '',
        endDate: ''
    };
    customReqObj = {
        startDate: '',
        endDate: '',
        bookmark: {}
    };

    onQueryData: any = [];
    queryDuring: string = ''; //查詢區間傳入明細查詢頁

    // -- 分頁start -- //
    pageCounter = 1; // 當前頁次
    totalPages = 0; // 全部頁面
    @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
    @ViewChild('pageBox7D', { read: ViewContainerRef }) pageBox7D: ViewContainerRef;
    @ViewChild('pageBox1M', { read: ViewContainerRef }) pageBox1M: ViewContainerRef;
    @ViewChild('pageBox3M', { read: ViewContainerRef }) pageBox3M: ViewContainerRef;
    @ViewChild('pageBox6M', { read: ViewContainerRef }) pageBox6M: ViewContainerRef;
    @ViewChild('pageBox12M', { read: ViewContainerRef }) pageBox12M: ViewContainerRef;
    // -- 分頁end -- //


    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateServcie: FormateService
        , private paginatorCtrl: PaginatorCtrlService
        , private _mainService: FundHasRealizeService
        , private _cacheService: CacheService
    ) {
    }


    ngOnInit() {
        this._cacheService.removeGroup('fund-proloss-list');
        // this._logger.log("inputType:", this.inputType);
        this._initEvent();
        this._setHeader();
    }


    /**
     * Scroll Event
     * @param next_page
     */
    onScrollEvent(next_page) {
        // this._logger.log("onScrollEvent!!!!!!!!");
        let appendBox: any;
        switch (this.nowPageType) {
            case '7D': appendBox = this.pageBox7D; break;
            case '1M': appendBox = this.pageBox1M; break;
            case '3M': appendBox = this.pageBox3M; break;
            case '6M': appendBox = this.pageBox6M; break;
            case 'detail':
            case '12M':
                appendBox = this.pageBox12M;
                break;
            case 'custom': appendBox = this.pageBox; break;
        }
        if (!appendBox && !this.detailReqObj.show) {
            this._logger.step('Deposit', 'stop scroll');
            return false;
        }
        this._logger.step('Deposit', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);
        this.pageCounter = next_page;
        let componentRef: any = this.paginatorCtrl.addPages(appendBox, HasRealizeDetailPageComponent);
        componentRef.instance.reqObj = this.detailReqObj;
        componentRef.instance.page = next_page;
        componentRef.instance.backPageEmit.subscribe(event => this.onPageBackEvent(event));
    }


    /**
     * 子層返回事件(分頁)
     * @param e
     */
    onPageBackEvent(e) {
        this._logger.step('Deposit', 'onPageBackEvent', e);
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
        // this._logger.log("pageType:", pageType);
        // this._logger.log("page:", page);
        // this._logger.log("tmp_data:", tmp_data);
        if (pageType === 'page_info') {
            // this._logger.log("page_info!!!!!!!!!!!");
            // this._logger.step('Deposit', 'set page', this.pageCounter, tmp_data);
            // 設定頁面資料
            if (this.pageCounter == 1) {
                this.itemData = tmp_data['summary_data'];
                if (tmp_data.hasOwnProperty('dataTime')) {
                    this.dataTime = tmp_data['dataTime'];
                }
                if (tmp_data.hasOwnProperty('page_info')) {
                    // 第一頁才要設定，其他不變
                    this.totalPages = tmp_data['page_info']['totalPages'];
                }
                if (tmp_data.hasOwnProperty('info_data')
                    && tmp_data['info_data'].hasOwnProperty('_queryDuring')) {
                    this.queryDuring = tmp_data['info_data']['_queryDuring'];
                }
            }
            return false;
        }

        if (page === 'queryDetail') {
            if (!!tmp_data) {
                this.onQueryData = tmp_data;
            }
            // this._logger.log("onQueryData:", this.onQueryData);
            this.goQuery = true;
        } else if (page === 'queryBack') {
            this.goQuery = false;
            this._resetPage();
            this._setHeader();
        }
    }

    /**
     * 失敗回傳(分頁)
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(e) {
        this._logger.step('Deposit', 'onErrorBackEvent', e);
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
                    errorObj['type'] = 'dialog';
                    this._handleError.handleError(errorObj);
                } else {
                    // 其他分頁錯誤顯示alert錯誤訊息
                    errorObj['type'] = 'dialog';
                    this._handleError.handleError(errorObj);
                }
                break;
        }
    }

    /**
     * 查詢返回事件
     * @param e
     */
    onSearchBack(e) {
        this._logger.step('Deposit', 'onSearchBack', e);
        let set_data: any;
        if (typeof e === 'object' && e.hasOwnProperty('data')) {
            set_data = e.data;
        }
        let pageData = this._formateServcie.transClone(this.customReqObj.bookmark);
        if (set_data.startDate === this.customReqObj.startDate &&
            set_data.endDate === this.customReqObj.endDate
        ) {
            // 無改變處理
            pageData['search_data']['startDate'] = this.customReqObj.startDate;
            pageData['search_data']['endDate'] = this.customReqObj.endDate;
        } else {
            // 重新查詢
            this._resetPage();
            pageData['search_data']['startDate'] = set_data.startDate;
            pageData['search_data']['endDate'] = set_data.endDate;
            this.customReqObj.startDate = set_data.startDate;
            this.customReqObj.endDate = set_data.endDate;
        }
        this.onChangePage('custom', pageData);
    }

    /**
     * 頁籤回傳
     * @param e
     */
    onBookMarkBack(e) {
        this._logger.step('Deposit', 'onBookMarkBack', e);
        let page = '';
        let set_data: any;
        let set_id: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('data')) {
                set_data = e.data;
                if (set_data.hasOwnProperty('id')) {
                    set_id = set_data.id;
                }
            }
        }

        if (set_id === 'summary') {
            // 帳戶匯總
            this.onChangePage('summary');
        } else if (set_id === 'custom') {
            // this._logger.step('Deposit', set_data, this.searchBoxRule);
            this.customReqObj.bookmark = set_data;
            this.onChangePage('custom', this._formateServcie.transClone(set_data));
        } else {
            if (set_id == 'detail') {
                this.checkTypeKey = 'detail';
            }

            this.onChangePage(set_id, set_data);
        }
    }



    /**
    * 頁面切換
    * @param pageType 頁面切換判斷參數
    *        'summary' : 帳戶彙總
    *        '7D' : 最近一周
    *        '1M' : 最近一月
    *        'custom' : 最近一周
    * @param pageData 其他資料
    */
    onChangePage(pageType: string, pageData?: any) {
        // this._logger.step('FUND', 'onChangePage', pageType, JSON.stringify(pageData));
        if (pageType === 'summary') {
            // 彙總資料
            this.detailReqObj.show = false;
            this.showSearchBox = false;
        } else if (pageType === 'search-box') {
            // 搜尋框
            this.showSearchBox = true;
            this.detailReqObj.show = false;
            // if (this.customReqObj.startDate == '' || this.customReqObj.endDate == '') {
            //     this.detailReqObj.show = false;
            // }
        } else if (pageData.hasOwnProperty('search_data')) {
            let show_detail = true;
            if (pageType === 'custom') {
                if (this.customReqObj.startDate == '' || this.customReqObj.endDate == '') {
                    // 先查詢再處理
                    this._resetPage();
                    this.onChangePage('search-box');
                    return false;
                }
                pageData['search_data']['startDate'] = this.customReqObj.startDate;
                pageData['search_data']['endDate'] = this.customReqObj.endDate;
            } else {
                if (pageData['search_data']['startDate'] == '' || pageData['search_data']['endDate'] == '') {
                    // 若無起迄日期時的例外處理
                    this._resetPage();
                    this.onChangePage('search-box');
                    return false;
                }
                this._resetPage();
            }
            // 顯示交易資料
            this.showSearchBox = false;
            // 將資料帶入下一頁(input)，當request送出
            this.detailReqObj = {
                id: pageType,
                show: show_detail,
                type: this.inputType,
                startDate: pageData['search_data']['startDate'],
                endDate: pageData['search_data']['endDate']
            };
            this._logger.step('Deposit', 'detailReqObj', JSON.stringify(this.detailReqObj));
        }
        this.nowPageType = pageType; // 切換查詢期間
        // this._logger.log("pageType:", pageType);
        if (this.pageCounter == 1
            && pageType === 'custom'
            && this.pageBox && typeof this.pageBox.clear !== 'undefined'
        ) {
            // 自動重查
            this.pageBox.clear();
        }
    }

    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'has-realize-tag',
            'type': 'back',
            'data': item
        };
        this.backPageEmit.emit(output);
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------
    private _initEvent() {
        this.bookmarkData = this._mainService.getBookmark(this.showNewType);
        // 查詢頁面條件
        this.searchBoxRule = this._mainService.getDateSet('custom');
        // 查詢頁面說明事項
        this.searchInfoData = [
            // 輸入查詢之起始日期及終止日期，外幣活期性存款可查詢本月及前三個月內資料。
            'PG_DEPOSIT.FOREX_DEPOSIT.SEARCH_INFO.INFO1'
        ];
        if (typeof this.inputType === 'undefined') {
            this.inputType = {
                type: '2'
            };
        }
    }

    private _resetPage() {
        this.pageCounter = 1;
        this.totalPages = 0;
        this.dataTime = '';
    }

    private _setHeader() {
        let show_title = (this._formateServcie.checkField(this.inputType, 'type') == '2')
                            ? 'PG_FUND.TITLE.REALIZE_NOW'
                            : 'PG_FUND.TITLE.REALIZE_PRE';
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': show_title
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.onBackPageData();
        });
    }

}

