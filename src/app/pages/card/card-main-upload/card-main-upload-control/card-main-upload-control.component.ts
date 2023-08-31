/**
 * 申請進度查詢(主控)
 */
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { CardMainUploadService } from '@pages/card/shared/service/card-main-upload/card-main-upload.service';
// import { MainUploadSearchPageComponent } from '../search/main-upload-search.component';

@Component({
    selector: 'app-card-upload-control',
    templateUrl: './card-main-upload-control.component.html',
    styleUrls: [],
    providers: []
})
export class CardMainUploadControlComponent implements OnInit {
    /**
     * 參數處理
     */
    // private _defaultHeaderOption: any; // header setting暫存
    showPage = 'queryPage';
    // == 分頁物件 == //
    // dataTime: string; // 資料日期
    // pageCounter = 1; // 當前頁次
    // totalPages = 0; // 全部頁面
    // @ViewChild('pageBox', { read: ViewContainerRef }) pageBox: ViewContainerRef;
    // == 內容頁物件 == //
    queryData: any = {}; //查詢頁點擊的該筆
    selectData: any = {}; //點擊的那筆資料(帶入上傳頁組裝request)
    custId = ''; //帶入上傳頁組裝request
    reqData: any; //fc001005 request
    resultData: any; //fc001005 response


    constructor(
        private _logger: Logger
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private authService: AuthService
        , private _mainService: CardMainUploadService
    ) { }

    ngOnInit() {
        this._logger.log("into card-main-load component!");
        const usercustId = this.authService.getCustId();
        this.custId = usercustId;
        // this._defaultHeaderOption = this.navgator.getHeader();
        this.onChangePage('queryPage');
    }

    /**
     * 列表回傳事件 
     * 
     * @param e
     */
    onPageBackEvent(e) {
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
        this.queryData = e.data;

        //前往下一頁
        if (pageType == 'go') {
            switch (page) {
                case 'searchPage': //查詢頁點擊上傳(返回) go
                    this.selectData = tmp_data; //將選擇的那筆帶入
                    this.onChangePage('editPage'); //進編輯頁
                    break;
                case 'upload': //編輯頁go
                    this.reqData = tmp_data; //帶入request fc001005
                    this.sendFC001005(this.reqData);
                    break;
                default:
                    this.onChangePage('queryPage');
            }
            //返回前一頁
        } else if (pageType == 'back') {
            switch (page) {
                case 'searchPage':
                    this._logger.log("into searchPage back");
                    this.navgator.push('card-quota-menu');
                    break;
                case 'editPage':
                    this.onChangePage('queryPage'); //返回查詢頁
                    break;
                default:
                    this.onChangePage('queryPage');
            }
        } else {
            if (page == 'list-item') { //分頁回傳(動態生成)
                // 設定頁面資料
                // if (tmp_data.hasOwnProperty('page_info')
                //     && this.pageCounter === 1
                // ) {
                //     // 第一頁才要設定，其他不變
                //     this.totalPages = tmp_data['page_info']['totalPages'];
                // }
                return false;
            }
        }


        // //查詢頁點擊上傳(返回) go
        // if(page == 'searchPage' && pageType == 'go') {
        //     this.onChangePage('editPage'); //進編輯頁
        // }
    }

    //發送fc001005上傳電文
    sendFC001005(setData) {
        this._logger.log("send api, setData:", setData);
        this._mainService.sendUpLoad(setData).then(
            (result) => {
                this._logger.log("105 result:", result);
                this.resultData = result.info_data;
                this._logger.log("resultData:", this.resultData);
                this.onChangePage('resultPage'); //進結果頁 //成功走結果頁
            },
            (errorObj) => {
                this._logger.log("105 errorObj:", errorObj);
                errorObj['type'] = 'message';
                errorObj['backType']='2';
                // errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                // errorObj['backType'] = 'online-loan';
                this._handleError.handleError(errorObj);
            }
        );
    }
    /**
     * Scroll Event
     * @param next_page
     */
    // onScrollEvent(next_page) {
    //     this._logger.log('pageCounter:', this.pageCounter, 'next_page:', next_page);
    //     this.pageCounter = next_page;
    //     const componentRef: any = this.paginatorCtrl.addPages(this.pageBox, MainUploadSearchPageComponent);
    //     componentRef.instance.page = next_page;
    //     componentRef.instance.backPageEmit.subscribe(event => this.onPageBackEvent(event));
    //     componentRef.instance.errorPageEmit.subscribe(event => this.onErrorBackEvent(event));
    // }

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

                // if (this.pageCounter === 1) {
                //     // 列表頁：首次近來錯誤推頁
                //     errorObj['type'] = 'message';
                //     errorObj['button'] = 'PG_ONLINE.BTN.BACKLOAN';
                //     errorObj['backType'] = 'online-loan';
                //     this._handleError.handleError(errorObj);
                // } else {
                // 其他分頁錯誤顯示alert錯誤訊息
                errorObj['type'] = 'message';
                errorObj['backType']='2';
                this._handleError.handleError(errorObj);
                // }
                break;
            case 'content':
                // == 內容返回(先顯示列表再顯示錯誤訊息) == //
                this.onChangePage('list');
                errorObj['type'] = 'message';
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
            case 'editPage':
                this.showPage = 'editPage'; //編輯頁
                break;
            case 'resultPage':
                this.showPage = 'resultPage'; //結果頁
                break;
            // default:
            //     this._resetPage();
            //     this.showPage = 'queryPage';
            //     this._headerCtrl.updateOption(this._defaultHeaderOption);
            //     break;
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

    // private _resetPage() {
    //     this.pageCounter = 1;
    //     this.totalPages = 0;
    // }


}
