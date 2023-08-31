/**
 * 停損停利設定/注意事項
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
    selector: 'app-enter-balance',
    templateUrl: './enter-balance.component.html',
    styleUrls: [],

})
export class EnterBalanceComponent implements OnInit {
    /**
     * 參數處理
     */
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    agreeChecked = false;

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _handleError: HandleErrorService
    ) {
    }

    ngOnInit() {
        this._logger.step('FUND', 'in balance page');
    }

    //同意
    onAgree() {
        this.onBackPageData({},'agree');
    }

    //不同意
    onAgreeNot() {
        this.onBackPageData({},'agree_not');
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item,status) {
        let output = {
            'page': 'enter-balance',
            'type': 'success',
            'data': item,
        };
        if(status == 'agree_not') {
            output.type = 'not_sucess'
        }
        this._logger.step('FUND', 'back output:', output);
        this.backPageEmit.emit(output);
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(error_obj) {
        let output = {
            'page': 'enter-agree',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'gold', error_obj);
        this.errorPageEmit.emit(output);
    }
}

