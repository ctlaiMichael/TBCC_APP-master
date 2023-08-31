/**
 * 外幣轉台幣父層
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
// == 分頁 == //

@Component({
    selector: 'app-foreign-twd-mainpage',
    templateUrl: './foreign-to-twd-mainpage.component.html',
    providers: []
})
export class ForeignToTwdMainComponent implements OnInit {
    /**
     * 參數處理
     */
    fromPage: string;
    assignPage = 'edit_page';
    // showInfoPage = false; // 顯示內容頁 false: 列表頁, true 內容頁
    counter: number = 0;
    // info_data = {};
    mainpageObj = {};
    securityResult: any;
    // == 分頁物件 == //

    private _defaultHeaderOption: any; // header setting暫存

    constructor(
        private _logger: Logger
        , private _headerCtrl: HeaderCtrlService
        , private _uiContentService: UiContentService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
    ) { }

    ngOnInit() {

        // this._mainService.showInfo();
    }

    /**
     * 子層返回事件
     * @param e
     */
    onBackPage(e) {

        this._logger.step('foreign-exchange', 'onBackPageinMain', e)
        let assignPage = 'edit_page';
        let tmp_data: any;
        if (typeof e === 'object') {

            if (e.hasOwnProperty('assignPage')) {
                assignPage = e.assignPage;
            }
            if (e.hasOwnProperty('data')) {
                tmp_data = e.data;
            }
            if (e.hasOwnProperty('securityResult')) {
                this.securityResult = e.securityResult;
            }
        }
        this.onChangePage(assignPage, tmp_data);
    }



    /**
    * 頁面切換
    * @param assignPage 頁面切換判斷參數
    *        'list' : 顯示額度使用明細查詢頁(page 1)
    *        'content' : 顯示額度使用明細結果頁(page 2)
    * @param pageData 其他資料
    */
    onChangePage(assignPage: string, sendData?: any) {
        // 顯示指定頁面
        this.assignPage = assignPage;
        this._logger.step('foreign-exchange', 'onChangePage', this.assignPage)
        this.mainpageObj = sendData;
    }

}

