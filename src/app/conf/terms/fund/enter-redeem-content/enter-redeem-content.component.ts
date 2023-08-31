/** 基金贖回(廢除)
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { DepositUtil } from '@shared/util/formate/mask/deposit-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
    selector: 'app-enter-redeem-content',
    templateUrl: './enter-redeem-content.component.html',
    styleUrls: [],

})
export class EnterRedeemContentComponent implements OnInit {
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
    }

    agree() {
        this.onBackPageData({});
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item) {
        let output = {
            'page': 'redeem-content',
            'type': 'success',
            'data': item,
        };
        this._logger.log('back output:', output);
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

