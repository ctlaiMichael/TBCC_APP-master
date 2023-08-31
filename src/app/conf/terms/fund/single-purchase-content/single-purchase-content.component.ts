/** 單筆申購說明
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { DepositUtil } from '@shared/util/formate/mask/deposit-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';

@Component({
    selector: 'app-single-purchase-content',
    templateUrl: './single-purchase-content.component.html',
    styleUrls: [],

})
export class SinglePurchaseContentComponent implements OnInit {
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
        , private microInteraction: MicroInteractionService
    ) {
    }

    ngOnInit() {
        this.microInteraction.hideMicroBox(true); // 微交互隱藏
    }

    onConfirm() {
        this.onBackPageData({});
        this.microInteraction.hideMicroBox(false); // 微交互開啟
    }

    /**
     * 重新設定page data
     * @param item
     */
    onBackPageData(item) {
        let output = {
            'page': 'single-purchase-content',
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
            'page': 'single-purchase-content',
            'type': 'error',
            'data': error_obj
        };
        this._logger.error('HomePage', 'gold', error_obj);
        this.errorPageEmit.emit(output);
    }
}

