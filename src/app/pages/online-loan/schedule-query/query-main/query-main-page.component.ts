/**
 * 申請進度查詢
 */
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
import { QueryEditPageComponent } from '../query-edit/query-edit-page.component';

@Component({
    selector: 'app-query-main',
    templateUrl: './query-main-page.component.html',
    styleUrls: [],
    providers: [PaginatorCtrlService]
})
export class QueryMainPageComponent implements OnInit {
    /**
     * 參數處理
     */
    private _defaultHeaderOption: any; // header setting暫存
    showPage = 'queryPage';
    // == 分頁物件 == //
    dataTime: string; // 資料日期
    pageCounter = 1; // 當前頁次
    totalPages = 0; // 全部頁面
    @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
    // == 內容頁物件 == //

    constructor(
        private _logger: Logger
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private paginatorCtrl: PaginatorCtrlService
    ) { }

    ngOnInit() {
        this._defaultHeaderOption = this.navgator.getHeader();
        this.onChangePage('queryPage');
    }

    /**
     * 列表回傳事件 
     * 
     * @param e
     */
    onPageBackEvent(e) {
        this._logger.log("pageCounter:",this.pageCounter);
        this._logger.step('FUND', 'onPageBackEvent', e);
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
                && this.pageCounter === 1
            ) {
                // 第一頁才要設定，其他不變
                this.totalPages = tmp_data['page_info']['totalPages'];
            }
            return false;
        }
    }

    /**
     * Scroll Event
     * @param next_page
     */
    onScrollEvent(next_page) {
        this._logger.log('pageCounter:', this.pageCounter, 'next_page:', next_page);
        this.pageCounter = next_page;
        const componentRef: any = this.paginatorCtrl.addPages(this.pageBox, QueryEditPageComponent);
        componentRef.instance.page = next_page;
        componentRef.instance.backPageEmit.subscribe(event => this.onPageBackEvent(event));
        componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(e) {
        this._logger.step('FUND', 'onErrorBackEvent', e);
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
            // page1 error回傳
            case 'list-item':
                // == 分頁返回 == //

                if (this.pageCounter === 1) {
                    // 列表頁：首次近來錯誤推頁
                    errorObj['type'] = 'message';
                    errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                    errorObj['backType'] = 'online-loan';
                    this._handleError.handleError(errorObj);
                } else {
                    // 其他分頁錯誤顯示alert錯誤訊息
                    errorObj['type'] = 'dialog';
                    this._handleError.handleError(errorObj);
                }
                break;
            case 'content':
                // == 內容返回(先顯示列表再顯示錯誤訊息) == //
                this.onChangePage('list');
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                break;
        }
    }

    /**
    * 頁面切換
    * @param pageType 頁面切換判斷參數
    * @param pageData 其他資料
    */
    onChangePage(pageType: string, pageData?: any) {
        let left_event: any = () => {
            this.navgator.push('online-loan');
        };
        switch (pageType) {
            case 'list':
            case 'queryPage': // 進度查詢
            this.showPage = 'queryPage';
            break;
            default:
                this._resetPage();
                this.showPage = 'queryPage';
                this._headerCtrl.updateOption(this._defaultHeaderOption);
                break;
        }
        this._headerCtrl.setLeftBtnClick(left_event);
    }



    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    private _resetPage() {
        this.pageCounter = 1;
        this.totalPages = 0;
    }


}
