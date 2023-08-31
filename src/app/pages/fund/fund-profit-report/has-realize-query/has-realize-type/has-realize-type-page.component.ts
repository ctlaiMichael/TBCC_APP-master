/**
 * 已實現損益明細(選擇年度：本年、前年)
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-has-realize-type',
    templateUrl: './has-realize-type-page.component.html',
    styleUrls: [],
    providers: []
})
export class HasRealizeTypePageComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

    //type 查詢類型： 1: 前一年度、2: 今年至上個月底（本年度）
    toRealizeTag = {
        type: ''
    };
    goRealizeTag = false;

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
    * 啟動事件
    */
    private _initEvent() {
        // 設定header
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': 'FUNC_SUB.FUND.REALIZE_SEARCH'
        });
    }

    // 點擊本年度
    onThisYear() {
        this.toRealizeTag.type = '2';
        this.goRealizeTag = true;
    }

    // 點擊前年度
    onBefore() {
        this.toRealizeTag.type = '1';
        this.goRealizeTag = true;
    }

    /**
     * 子層返回事件(分頁)
     * @param e
     */
    onBackPage(e) {
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

        if (page == 'has-realize-tag') {
            this.goRealizeTag = false;
            this._initEvent();
        }
    }


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
