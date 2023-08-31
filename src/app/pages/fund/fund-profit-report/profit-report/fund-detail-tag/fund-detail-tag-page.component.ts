/**
 * 基金庫存明細(主Tag，控制基金損益、交易明細)
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewContainerRef, ViewChild } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { FormateService } from '@shared/formate/formate.service';
import { FundDetailTagService } from '@pages/fund/shared/service/fund-detail-tag.service';
import { FundDetailTransactionComponent } from '../fund-detail-transaction/fund-detail-transaction-page.component';
import { logger } from '@shared/util/log-util';
import { NavgatorService } from '@core/navgator/navgator.service';


@Component({
    selector: 'app-fund-detail-tag',
    templateUrl: './fund-detail-tag-page.component.html',
    styleUrls: [],
    providers: [PaginatorCtrlService,FundDetailTagService]
})
export class FundDetailTagPagaComponent implements OnInit {
   /**
     * 參數處理
     */
    @Input() inputData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    bookmarkData = []; // 頁籤設定
    nowPageType = ''; // 當前頁面名稱
    showSearchBox = false; // 顯示查詢box
    searchInfoData: Array<any>;
    searchBoxRule: any;
    dataTime: string; // 查詢時間
    itemData: any; // 帳戶彙總
    // 查詢條件
    detailReqObj = {
        id: '',
        show: false,
        transCode: '',
        fundCode: '',
        startDate: '',
        endDate: ''
    };
    customReqObj = {
        startDate: '',
        endDate: '',
        bookmark: {}
    };

    // -- 分頁start -- //
    pageCounter = 1; // 當前頁次
    totalPages = 0; // 全部頁面
    @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
    @ViewChild('pageBox7D', { read: ViewContainerRef }) pageBox7D: ViewContainerRef;
    @ViewChild('pageBox1M', { read: ViewContainerRef }) pageBox1M: ViewContainerRef;
    @ViewChild('pageBox12M', { read: ViewContainerRef }) pageBox12M: ViewContainerRef;
    // -- 分頁end -- //

    showDetailRow = true; //交易明細顯示 上方欄位
    goQuery = false; //是否顯示詳細資料(第三層)
    queryData:any = [];
    queryInfoData:any = {};
    fundType: string = ''; //信託業務別
    //預設頁籤，bookmark用
    default = 'summary';

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _handleError: HandleErrorService
        , private _formateServcie: FormateService
        , private paginatorCtrl: PaginatorCtrlService
        , private navgator: NavgatorService
        , private _mainService: FundDetailTagService
    ) {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.onBackPageData();
        });
    }


    ngOnInit() {
        this._initEvent();
        if(this.nowPageType == 'custom') {
            this.showDetailRow = false;
        }
    }
    // 理財金庫導頁191112
    goWeb() {
        this.navgator.push('web:fundCashBox', {}, { FUNDID: this.inputData['fundCode'], FILE: '02' });
    }

    /**
     * Scroll Event
     * @param next_page
     */
    onScrollEvent(next_page) {
        let appendBox: any;
        switch (this.nowPageType) {
            case '7D': appendBox = this.pageBox7D; break;
            case '1M': appendBox = this.pageBox1M; break;
            case '12M': appendBox = this.pageBox12M; break;
            case 'custom': appendBox = this.pageBox; break;
        }
        if (!appendBox && !this.detailReqObj.show) {
            this._logger.step('Deposit', 'stop scroll');
            return false;
        }
        this._logger.step('Deposit', 'onScrollEvent', this.pageCounter, 'totalPages', this.totalPages, 'next_page', next_page);
        this.pageCounter = next_page;
        let componentRef: any = this.paginatorCtrl.addPages(appendBox, FundDetailTransactionComponent);
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
        let info_data: any;
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
            if (e.hasOwnProperty('info_data')) {
                info_data = e.info_data;
            }
        }
        if (pageType === 'page_info') {
            this._logger.step('Deposit', 'set page', this.pageCounter, tmp_data);
            // 設定頁面資料
            if (this.pageCounter == 1) {
                this.itemData = tmp_data['summary_data'];
                if (tmp_data.hasOwnProperty('dataTime')) {
                    this.dataTime = tmp_data['dataTime'];
                }
                if (tmp_data.hasOwnProperty('page_info')) {
                    // 第一頁才要設定，其他不變
                    this.totalPages = tmp_data['page_info']['totalPages'];
                    this.fundType = tmp_data['info_data']['fundType'];
                }
            }
            if(page == 'queryDetail') {
                this.queryData = tmp_data;
                this.queryInfoData = info_data;
                this.goQuery = true;
            } else if(page == 'detailLeftBack') {
                logger.error("page=detailLeftBack, into detail-tag!!");
                this.queryData = tmp_data;
                this.queryInfoData = info_data;
                this.goQuery = false;
                //下方為修改
                this._resetPage();
                this.default = 'detail';
            } else if(page == 'detail-back') {
                this.onBackPageData(e);
            }
            return false;
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
            this._logger.step('Deposit', set_data, this.searchBoxRule);
            this.customReqObj.bookmark = set_data;
            this.onChangePage('custom', this._formateServcie.transClone(set_data));
        } else {
            this.onChangePage(set_id, set_data);
        }
    }



    /**
    * 頁面切換
    * @param pageType 頁面切換判斷參數
    *        'summary' : 帳戶彙總
    *        '7D' : 最近一周 (4/24已廢除)
    *        '3M' : 最近三個月
    *        '6M' : 最近六個月
    *        '12M' : 最近一年
    *        'custom' : 最近一周
    * @param pageData 其他資料
    */
    onChangePage(pageType: string, pageData?: any) {
        this._logger.step('Deposit', 'onChangePage', pageType, JSON.stringify(pageData));
        if (pageType === 'summary') {
            this.detailReqObj.show = false;
            this.showSearchBox = true;
        } else if (pageType === 'search-box') {
            this.showSearchBox = true;
            this.detailReqObj.show = false;
            // if (this.customReqObj.startDate == '' || this.customReqObj.endDate == '') {
            //     this.detailReqObj.show = false;
            // }
        } else if (pageData.hasOwnProperty('search_data')) {
            let show_detail = true;
            if (pageType === 'custom') {
                this.showDetailRow = false;
                if (this.customReqObj.startDate == '' || this.customReqObj.endDate == '') {
                    // 先查詢再處理
                    this._resetPage();
                    this.onChangePage('search-box');
                    return false;
                }
                pageData['search_data']['startDate'] = this.customReqObj.startDate;
                pageData['search_data']['endDate'] = this.customReqObj.endDate;
            } else {
                this.showDetailRow = true;
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
            this.detailReqObj = {
                id: pageType,
                show: show_detail,
                transCode: this.inputData['transCode'],
                fundCode: this.inputData['fundCode'],
                startDate: pageData['search_data']['startDate'],
                endDate: pageData['search_data']['endDate']
            };
            this._logger.step('Deposit', 'detailReqObj', JSON.stringify(this.detailReqObj));
        }
        this.nowPageType = pageType; // 切換查詢期間
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
            'page': 'deposit-demand',
            'type': 'back',
            'data': item
        };
        if(item.hasOwnProperty('page')) {
            output.page = item.page;
        }
        if(item.hasOwnProperty('type')) {
            output.type = item.type;
        }
        if(item.hasOwnProperty('data')) {
            output.data = item.data;
        }
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
        this.bookmarkData = this._mainService.getBookmark();
        // 查詢頁面條件
        this.searchBoxRule = this._mainService.getDateSet('custom');
        // 查詢頁面說明事項
        this.searchInfoData = [
            // 輸入查詢之起始日期及終止日期，外幣活期性存款可查詢本月及前三個月內資料。
            // 4/24/需求變更可查詢一年之資料
            'PG_DEPOSIT.FOREX_DEPOSIT.SEARCH_INFO.INFO1'
        ];
    }

    private _resetPage() {
        this.pageCounter = 1;
        this.totalPages = 0;
    }

}