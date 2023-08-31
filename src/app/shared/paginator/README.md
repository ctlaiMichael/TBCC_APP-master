# 功能說明：分頁

## Page Component建立
### NgModule: entryComponents
    import { PaginatorCtrlModule } from '@shared/paginator/paginator-ctrl.module';
    @NgModule({
        imports: [
            PaginatorCtrlModule
        ],
        declarations: [
            MyPageComponent
        ],
        entryComponents: [
            MyPageComponent
        ]
    })


### Main Component
    import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
    // == 分頁 == //
    import { PaginatorCtrlService } from '@shared/paginator/paginator-ctrl.srevice';
    import { MyPageComponent } from './my-page.component';
    // == 分頁 End == //

    @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;


    constructor(
        private _logger: Logger
        , private paginatorCtrl: PaginatorCtrlService
    ) { }

    onScrollEvent(next_page) {
        console.log("page", this.pageCounter, "totalPages", this.totalPages, "next_page", next_page);
        this.pageCounter = next_page;
        let componentRef: any = this.paginatorCtrl.addPages(this.firstpage, MyPageComponent);
        componentRef.instance.page = this.pageCounter;
        componentRef.instance.backPageEmit.subscribe(event => this.onBackPage(event));
    }

### Main Html
    <section paginatorCtrl [nowPage]="pageCounter" [totalPages]="totalPages" (scrollEvent)="onScrollEvent($event)">
        <my-page [page]="1" (backPageEmit)="onBackPage($event)"></my-page>
        <ng-container #pageBox></ng-container>
    </section>

### totalPages
#### Page Componetn


    this._mainService.getData(this.page).then(
      (result) => {
        this.data = result.data;
        this.onBackPageData(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );

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
            'page': 'list',
            'type': 'error',
            'data': error_obj
        };

        this.errorPageEmit.emit(error_obj);
    }

#### Main Componetn

    /**
    * 子層返回事件
    * @param e 
    */
    onBackPage(e) {
        this._logger.step('NEWS', 'onBackPage', e);
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
        if (page === 'list-item' && pageType === 'page_info' ) {
            // 設定頁面資料
            if (tmp_data.hasOwnProperty('page_info')
                && this.pageCounter == 1
            ) {
                // 第一頁才要設定，其他不變
                this.totalPages = tmp_data['page_info']['totalPages'];
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
        this._logger.step('NEWS', 'onErrorBackEvent', e);
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

        if (page === 'list-item' && this.pageCounter == 1) {
            // 列表頁：首次近來錯誤推頁
            errorObj['type'] = 'message';
            this._handleError.handleError(errorObj);
        }

    }

## 模擬資料建立

    import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';
    public getResponse(reqObj) {
        const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
        let output_data = PaginatorSimlationUtil.getResponse(fb000501_res_01, paginatedInfo, 'details.detail');
        return output_data;
    }

