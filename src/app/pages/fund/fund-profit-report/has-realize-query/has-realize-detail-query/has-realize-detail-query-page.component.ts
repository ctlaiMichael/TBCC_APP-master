/**
 * 已實現損益明細查詢
 * (Fi000202 response)
 * fundCode	投資代碼
 * fundName	投資標的名稱
 * riskRank	基金風險等級
 * incomeState	全年損益
 * trustDate	信託日期
 * currency1	投資幣別
 * amount	原始信託金額(1)
 * terminateDate	解約日期
 * terminateAmount	解約金額(2)
 * intAmt	交易所得(3)
 * onDate	股利收入日期
 * payAmt	給付總額(4)
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
    selector: 'app-has-realize-detail-query',
    templateUrl: './has-realize-detail-query-page.component.html',
    styleUrls: [],
    providers: []
})
export class HasRealizeDetailQueryPageComponent implements OnInit {
    @Input() inputData: any;
    @Input() queryDuring: string;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

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
    }

    /**
      * 重新設定page data
      * @param item
      */
    onBackPageData() {
        const output = {
            'page': 'queryBack',
            'type': 'back',
            'data': {}
        };
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
        // 設定header
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            // 基金已實現損益明細
            'title': 'PG_FUND.TITLE.REALIZE_DETAIL'
        });

        this._headerCtrl.setLeftBtnClick(() => {
            this.onBackPageData();
        });
    }

    //點擊確認
    onConfirm() {
        this.onBackPageData();
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
