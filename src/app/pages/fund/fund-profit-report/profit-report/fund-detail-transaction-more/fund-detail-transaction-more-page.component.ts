/**
 * 基金交易明細(詳細資料頁，第三層)
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
    selector: 'app-fund-detail-transaction-more',
    templateUrl: './fund-detail-transaction-more-page.component.html',
    styleUrls: [],
    providers: []
})
export class FundDetailTransactionMoreComponent implements OnInit {
    @Input() queryData: any; //上一頁點選的資料 []
    @Input() queryInfoData: any; //上一頁的info資料
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    transType = ''; //異動性質

    constructor(
        private _logger: Logger
        , private router: Router
        , private confirm: ConfirmService
        , private _handleError: HandleErrorService
        , private navgator: NavgatorService
        , private _headerCtrl: HeaderCtrlService

    ) {
    }

    ngOnInit() {
        this._initEvent();
        this.transType = this.queryData.transType;
    }

    /**
      * 重新設定page data
      * @param item
      */
    onBackPageData(item, page?) {
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item
        };
        if (page === 'detailLeftBack') {
            output.page = page;
        }
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        const output = {
            'page': 'list-item',
            'type': 'error',
            'data': error_obj
        };

        this.errorPageEmit.emit(output);
    }

    /**
* 啟動事件
*/
    private _initEvent() {
        //設定header
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '基金交易明細'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            let page = 'detailLeftBack'
            this.onBackPageData({},page);
        });
    }

    /**
     * go
     *
     */

    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

}